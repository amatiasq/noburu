import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { RequiredIngredients } from '../components-smart/RequiredIngredients';
import { RequiredRecipes } from '../components-smart/RequiredRecipes';
import { AutoSaveForm } from '../components/AutoSaveForm';
import { bindControl } from '../components/Control';
import { Dropdown } from '../components/Dropdown';
import { bindFormControl } from '../components/FormControl';
import { Loading } from '../components/Loading';
import { NumberInput } from '../components/NumberInput';
import { AUTOSAVE_DELAY } from '../constants';
import { useFire } from '../hooks/useFire';
import { Cake, CakeId, cakeSchema } from '../model/Cake';
import { multiplierOptions } from '../model/Multipliers';

const CakeControl = bindFormControl<Cake>();
const CakeSimpleControl = bindControl<Cake>();

export interface CakeViewProps {}

export function CakeView() {
  const { id } = useParams<{ id: CakeId }>();
  const { isLoading, data, set } = useFire<Cake>('pasteles', id!);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Heading as="h1">Receta: {data.name}</Heading>

      <AutoSaveForm
        initialValues={data}
        validationSchema={cakeSchema}
        delayMs={AUTOSAVE_DELAY}
        onSubmit={(x) => set(x)}
      >
        {({ values }) => {
          values.cost =
            values.recipes.reduce((sum, x) => sum + x.cost, 0) +
            values.ingredients.reduce((sum, x) => sum + x.cost, 0);

          return (
            <VStack align="stretch">
              <CakeControl name="name" label="Nombre" />
              <CakeControl name="pax" label="PAX" as={NumberInput} />

              <FormControl>
                <FormLabel>Coste</FormLabel>
                <InputGroup>
                  <Input value={values.cost.toFixed(2)} isReadOnly />
                  <InputRightAddon>€</InputRightAddon>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Precio</FormLabel>
                <InputGroup>
                  <InputLeftElement width="4rem">
                    <CakeSimpleControl
                      name="multiplier"
                      as={Dropdown}
                      options={multiplierOptions}
                    />
                  </InputLeftElement>
                  <Input
                    value={(values.cost * values.multiplier).toFixed(2)}
                    isReadOnly
                    paddingLeft="6rem"
                  />
                  <InputRightAddon>€</InputRightAddon>
                </InputGroup>
              </FormControl>

              <RequiredRecipes pax={values.pax} />
              <RequiredIngredients />
            </VStack>
          );
        }}
      </AutoSaveForm>
    </>
  );
}
