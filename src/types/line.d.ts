type TGetLineAccessTokenRes = {
  access_token: string;
  token_type: string;
  expires_in: number;
  key_id: string;
};

type TUserLine = {
  displayName: string;
  userId: string;
  language: string;
  pictureUrl: string;
  statusMessage: string;
};
