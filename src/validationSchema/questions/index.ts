import * as yup from 'yup';

export const questionValidationSchema = yup.object().shape({
  text: yup.string().required(),
  user_id: yup.string().nullable(),
});
