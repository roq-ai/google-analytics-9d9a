import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getAnalysisById, updateAnalysisById } from 'apiSdk/analyses';
import { Error } from 'components/error';
import { analysisValidationSchema } from 'validationSchema/analyses';
import { AnalysisInterface } from 'interfaces/analysis';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { QuestionInterface } from 'interfaces/question';
import { getQuestions } from 'apiSdk/questions';

function AnalysisEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AnalysisInterface>(
    () => (id ? `/analyses/${id}` : null),
    () => getAnalysisById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AnalysisInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAnalysisById(id, values);
      mutate(updated);
      resetForm();
      router.push('/analyses');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<AnalysisInterface>({
    initialValues: data,
    validationSchema: analysisValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Analysis
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="chart_data" mb="4" isInvalid={!!formik.errors?.chart_data}>
              <FormLabel>Chart Data</FormLabel>
              <Input type="text" name="chart_data" value={formik.values?.chart_data} onChange={formik.handleChange} />
              {formik.errors.chart_data && <FormErrorMessage>{formik.errors?.chart_data}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<QuestionInterface>
              formik={formik}
              name={'question_id'}
              label={'Select Question'}
              placeholder={'Select Question'}
              fetcher={getQuestions}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.text}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'analysis',
  operation: AccessOperationEnum.UPDATE,
})(AnalysisEditPage);
