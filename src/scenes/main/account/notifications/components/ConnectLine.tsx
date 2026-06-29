"use client";

import { useUpdateBusinessUserLineIdQuery } from "@/api/queries/users";
import Button from "@/components/ui/button";
import Line from "@/components/ui/icons/Line";
import { useAppSession } from "@/hooks/useAppSession";
import { Link } from "@/i18n";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const getLineOAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || "";
  const redirectUri = "http://localhost:3000/api/line/callback";
  const state = Math.random().toString(36).substring(2);
  const scope = "openid profile";

  const queryString = new URLSearchParams({
    response_type: "code",
    bot_prompt: "aggressive",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope,
  });

  return `https://access.line.me/oauth2/v2.1/authorize?${queryString.toString()}`;
};

const ConnectLine = () => {
  const { data: session } = useAppSession();
  const params = useSearchParams();
  const userId = params.get("userId");
  const displayName = params.get("displayName");

  const updateBusinessUserLineIdQuery = useUpdateBusinessUserLineIdQuery();

  // useEffect(() => {
  //   const setLineUserId = async () => {
  //     await updateBusinessUserLineIdQuery.mutateAsync({
  //       userId: session?.user?.id || -1,
  //       lineUserId: userId!,
  //     });
  //   };

  //   userId && void setLineUserId();
  // }, [userId]);

  return (
    <div className="h-full">
      <p className="mb-3 text-sm font-bold">Connect notifications via LINE</p>
      {userId || session?.user?.line_user_id ? (
        <Button
          variant="primary"
          className="py-2 bg-greenPrimary"
          iconLeft={<Line className="stroke-none" />}
        >
          @{displayName}
        </Button>
      ) : (
        <Link href={getLineOAuthUrl()} target="_blank">
          <Button
            variant="primary"
            className="py-2 bg-greenPrimary"
            iconLeft={<Line className="stroke-none" />}
          >
            Connect LINE
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ConnectLine;
