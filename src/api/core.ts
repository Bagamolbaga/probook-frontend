/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosHeaders,
  AxiosResponseHeaders,
} from "axios";
import { signOut } from "next-auth/react";
import * as Sentry from "@sentry/nextjs";

export const axiosInstanceWithoutAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

export class ApiClientCore {
  public readonly instance: AxiosInstance;
  public readonly instanceWithoutAuth: AxiosInstance;
  public readonly currentUserId: number;

  constructor(accessToken: string, currentUserId: number) {
    this.currentUserId = currentUserId;
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    this.instanceWithoutAuth = axiosInstanceWithoutAuth;

    this.setupInterceptors();
  }

  private async errorInterceptor(error: AxiosError) {
    console.log("Interceptor caught:", error);

    const originalRequest = error.config as AxiosRequestConfig & {
      sentryLogged?: boolean;
    };

    // Защита от дублирования логов (если ошибка уже залогирована)
    if (originalRequest.sentryLogged) {
      return Promise.reject(error);
    }
    originalRequest.sentryLogged = true;

    // Подготовка данных для Sentry
    const requestInfo = {
      url: originalRequest.url,
      method: originalRequest.method,
      data: originalRequest.data,
      headers: this.sanitizeHeaders(originalRequest.headers as AxiosHeaders),
      params: originalRequest.params,
    };

    const responseInfo = error.response
      ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: this.sanitizeHeaders(error.response.headers as AxiosResponseHeaders),
        }
      : {
          status: "none",
          data: "No response received (network error, CORS, timeout, etc.)",
        };

    const extra = {
      request: requestInfo,
      response: responseInfo,
      currentUserId: this.currentUserId,
    };

    const tags = {
      api: "true",
      http_status: responseInfo.status,
      method: requestInfo.method,
    };

    const level = error.response?.status === 401 ? "info" : "error";

    // Fingerprint для группировки: по URL и статусу
    const fingerprint = [
      "api-request-error",
      requestInfo.method?.toUpperCase() || "unknown",
      String(responseInfo.status),
      requestInfo.url || "unknown-url",
    ];

    // Установка контекста и отправка в Sentry
    Sentry.withScope((scope) => {
      scope.setTags(tags);
      scope.setExtra("API Request Details", extra);
      scope.setUser({ id: String(this.currentUserId) });
      scope.setFingerprint(fingerprint);
      scope.setLevel(level);

      // Контекст: device, browser и т.п. (если нужно)
      scope.setContext("Request", requestInfo);
      if (responseInfo.status !== "none") {
        scope.setContext("Response", responseInfo);
      }

      // Отправляем ошибку
      Sentry.captureException(
        new Error(`API Error: ${requestInfo.method?.toUpperCase()} ${requestInfo.url}`),
        {
          originalException: error, // сохраняем оригинальный AxiosError
        }
      );
    });

    // Обработка 401
    if (error.response?.status === 401) {
      await signOut({ redirect: false });
      // Можно не логировать 401 как ошибку, если это ожидаемо
      // Sentry уже залогировал с level: 'info'
    }

    return Promise.reject(error);
  }

  private setupInterceptors() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => this.errorInterceptor(error)
    );
    
    this.instanceWithoutAuth.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => this.errorInterceptor(error)
    );
  }

  // Вспомогательная функция: очистка чувствительных заголовков
  private sanitizeHeaders(headers: AxiosHeaders | AxiosResponseHeaders) {
    if (!headers) return headers;

    const sanitized = { ...headers };
    if (sanitized.Authorization) {
      sanitized.Authorization = "[REDACTED]";
    }
    if (sanitized.authorization) {
      sanitized.authorization = "[REDACTED]";
    }
    return sanitized;
  }
}
