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
import { getGoogleAnalyticsById, updateGoogleAnalyticsById } from 'apiSdk/google-analytics';
import { Error } from 'components/error';
import { googleAnalyticsValidationSchema } from 'validationSchema/google-analytics';
import { GoogleAnalyticsInterface } from 'interfaces/google-analytics';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function GoogleAnalyticsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<GoogleAnalyticsInterface>(
    () => (id ? `/google-analytics/${id}` : null),
    () => getGoogleAnalyticsById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: GoogleAnalyticsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateGoogleAnalyticsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/google-analytics');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<GoogleAnalyticsInterface>({
    initialValues: data,
    validationSchema: googleAnalyticsValidationSchema,
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
            Edit Google Analytics
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
            <FormControl id="access_token" mb="4" isInvalid={!!formik.errors?.access_token}>
              <FormLabel>Access Token</FormLabel>
              <Input
                type="text"
                name="access_token"
                value={formik.values?.access_token}
                onChange={formik.handleChange}
              />
              {formik.errors.access_token && <FormErrorMessage>{formik.errors?.access_token}</FormErrorMessage>}
            </FormControl>
            <FormControl id="refresh_token" mb="4" isInvalid={!!formik.errors?.refresh_token}>
              <FormLabel>Refresh Token</FormLabel>
              <Input
                type="text"
                name="refresh_token"
                value={formik.values?.refresh_token}
                onChange={formik.handleChange}
              />
              {formik.errors.refresh_token && <FormErrorMessage>{formik.errors?.refresh_token}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
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
  entity: 'google_analytics',
  operation: AccessOperationEnum.UPDATE,
})(GoogleAnalyticsEditPage);
