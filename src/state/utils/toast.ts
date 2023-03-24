import { createStandaloneToast } from '@chakra-ui/toast';

const { toast } = createStandaloneToast();

export const successToast = (text: string) => {
  return toast({
    title: 'Success!',
    description: text,
    status: 'success',
    duration: 2000,
    isClosable: true
  });
};

export const errorToast = (text: string) => {
  return toast({
    title: 'Error!',
    description: text,
    status: 'error',
    duration: 2000,
    isClosable: true
  });
};


