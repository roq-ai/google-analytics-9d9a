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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createGoogleAnalytics } from 'apiSdk/google-analytics';
import { Error } from 'components/error';
import { googleAnalyticsValidationSchema } from 'validationSchema/google-analytics';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { GoogleAnalyticsInterface } from 'interfaces/google-analytics';

function GoogleAnalyticsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: GoogleAnalyticsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createGoogleAnalytics(values);
      resetForm();
      router.push('/google-analytics');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<GoogleAnalyticsInterface>({
    initialValues: {
      access_token: '',
      refresh_token: '',
      user_id: (router.query.user_id as string) ?? null,
    },
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
            Create Google Analytics
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="access_token" mb="4" isInvalid={!!formik.errors?.access_token}>
            <FormLabel>Access Token</FormLabel>
            <Input type="text" name="access_token" value={formik.values?.access_token} onChange={formik.handleChange} />
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'google_analytics',
  operation: AccessOperationEnum.CREATE,
})(GoogleAnalyticsCreatePage);
