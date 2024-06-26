import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Icon,
  IconButton,
  Stack,
  StackProps,
  useId,
} from '@chakra-ui/react';
import { FieldArray, useFormikContext } from 'formik';
import { ReactNode } from 'react';
import { FaPlus } from 'react-icons/fa';

export interface FormListProps<T> extends Omit<StackProps, 'children'> {
  name: string;
  label: string;
  info?: string;
  addLabel: string;
  addItem: () => T | Promise<T>;
  onRemove?: (item: T, index: number) => unknown | Promise<unknown>;
  children: (x: {
    index: number;
    item: T;
    all: T[];
    replace: (index: number, value: T) => void;
    remove(): void;
  }) => ReactNode;
}

export function FormList<T>({
  label,
  info,
  name,
  addLabel,
  addItem,
  onRemove,
  gridArea,
  children,
  ...stackProps
}: FormListProps<T>) {
  const id = useId();
  const form = useFormikContext();
  const { value } = form.getFieldMeta<T[]>(name);

  return (
    <Box gridArea={gridArea}>
      <FieldArray name={name}>
        {({ push, remove, replace }) => (
          <>
            <FormControl paddingTop={16} paddingBottom={3}>
              <Grid templateColumns="1fr auto">
                <FormLabel htmlFor={id}>
                  <Heading as="h3" fontSize="2xl">
                    {label}
                  </Heading>
                </FormLabel>

                <IconButton
                  id={id}
                  title={addLabel}
                  aria-label={addLabel}
                  icon={<Icon as={FaPlus} />}
                  colorScheme="green"
                  onClick={async () => push(await addItem())}
                />
              </Grid>

              {info ? <FormHelperText>{info}</FormHelperText> : null}
            </FormControl>

            <Stack direction="column" align="stretch" {...stackProps}>
              {(value ?? []).map((item, index) => {
                const handleRemove = onRemove
                  ? () => {
                      onRemove(item, index);
                      remove(index);
                    }
                  : () => remove(index);

                return children({
                  index,
                  item,
                  remove: handleRemove,
                  replace,
                  all: value,
                });
              })}
            </Stack>
          </>
        )}
      </FieldArray>
    </Box>
  );
}

FormList.displayName = 'FormList';
