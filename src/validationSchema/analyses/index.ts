import * as yup from 'yup';

export const analysisValidationSchema = yup.object().shape({
  chart_data: yup.string().required(),
  question_id: yup.string().nullable(),
});
