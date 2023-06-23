import * as yup from 'yup';

export const googleAnalyticsValidationSchema = yup.object().shape({
  access_token: yup.string().required(),
  refresh_token: yup.string().required(),
  user_id: yup.string().nullable(),
});
