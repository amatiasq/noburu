import {
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { RequiredIngredients } from '../components-smart/RequiredIngredients';
import { RequiredRecipes } from '../components-smart/RequiredRecipes';
import { AutoSaveForm } from '../components/AutoSaveForm';
import { AutoSaveFormStatus } from '../components/AutoSaveFormStatus';
import { bindControl } from '../components/Control';
import { Dropdown } from '../components/Dropdown';
import { bindFormControl } from '../components/FormControl';
import { Loading } from '../components/Loading';
import { NumberInput } from '../components/NumberInput';
import { AUTOSAVE_DELAY } from '../constants';
import { useFire } from '../hooks/useFire';
import { useFireList } from '../hooks/useFireList';
import { Ingredient } from '../model/Ingredient';
import { calculateIngredientsCost } from '../model/IngredientUsage';
import { Recipe } from '../model/Recipe';
import type { RecipeId } from '../model/RecipeId';
import { RecipeUnit } from '../model/RecipeUnit';
import { calculateRecipesCost } from '../model/RecipeUsage';
import { capitalise } from '../util/capitalise';

const RecipeControl = bindFormControl<Recipe>();
const RecipeControlSimple = bindControl<Recipe>();

export interface RecipeViewProps {}

export function RecipeView() {
  const { id } = useParams<{ id: RecipeId }>();
  const { isLoading, data, set } = useFire<Recipe>('recetas', id!);
  const ingredients = useFireList<Ingredient>('ingredientes');
  const recipes = useFireList<Recipe>('recetas');

  const save = useCallback(
    (values: Recipe) => set({ ...values, name: capitalise(values.name) }),
    [set]
  );

  if (isLoading || ingredients.isLoading) {
    return <Loading />;
  }

  return (
    <AutoSaveForm
      initialValues={data}
      validationSchema={Recipe}
      delayMs={AUTOSAVE_DELAY}
      onSubmit={save}
    >
      {({ values }) => {
        values.recipes ??= [];
        values.cost =
          calculateIngredientsCost(values.ingredients, ingredients.data) +
          calculateRecipesCost(id!, values.recipes, recipes.data);

        return (
          <VStack align="stretch">
            <Grid templateColumns="1fr auto" alignItems="center">
              <Heading as="h1">{data.name}</Heading>
              <AutoSaveFormStatus />
            </Grid>

            <RecipeControl name="name" label="Nombre" autoFocus />

            <Grid templateColumns="1fr 1fr" gap="var(--chakra-space-2)">
              <FormControl>
                <FormLabel>Cantidad</FormLabel>
                <InputGroup>
                  <RecipeControlSimple name="amount" as={NumberInput} />
                  <InputRightElement width="5rem">
                    <RecipeControlSimple
                      name="unit"
                      as={Dropdown}
                      // options is a property of Dropdown
                      // Chakra knows that but for some reason typescript complains
                      // @ts-ignore see above
                      options={RecipeUnit}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Coste</FormLabel>
                <InputGroup>
                  <Input value={values.cost.toFixed(2)} isReadOnly />
                  <InputRightAddon>€</InputRightAddon>
                </InputGroup>
              </FormControl>
            </Grid>

            <RequiredRecipes />
            <RequiredIngredients />
          </VStack>
        );
      }}
    </AutoSaveForm>
  );
}
