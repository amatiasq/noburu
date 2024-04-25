import {
  Grid,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
} from '@chakra-ui/react';

import { bindControl } from '../components/Control';
import { DeleteButton } from '../components/DeleteButton';
import { Dropdown } from '../components/Dropdown';
import { FormList } from '../components/FormList';
import { Loading } from '../components/Loading';
import { NumberInput } from '../components/NumberInput';
import { useFireList } from '../hooks/useFireList';
import { calculateIngredientCost, Ingredient } from '../model/Ingredient';
import type { IngredientId } from '../model/IngredientId';
import { ingredientToUsage, IngredientUsage } from '../model/IngredientUsage';
import { getConversionsFor } from '../model/Unit';
import { focusNextInput } from '../util/focusNextInput';
import { unkonwnEntity } from '../util/unknownEntity';

export interface RequiredIngredientsProps {
  gridArea?: string;
}

const IngredientControl = bindControl<
  IngredientUsage,
  `ingredients.${number}.`
>();

export function RequiredIngredients({ gridArea }: RequiredIngredientsProps) {
  const { data, isLoading } = useFireList<Ingredient>('ingredientes', {
    orderBy: 'name',
  });

  if (isLoading) {
    return <Loading />;
  }

  const getIngredient = (id: IngredientId) => data.find((x) => x.id === id)!;
  const names = data.map((x) => ({ value: x.id, label: x.name }));
  const [defaultIngredient] = data;

  return (
    <FormList<IngredientUsage>
      gridArea={gridArea}
      gap={['var(--chakra-space-6)', 'var(--chakra-space-2)']}
      name="ingredients"
      label="Ingredientes"
      addLabel="Añadir ingrediente"
      addItem={() => ingredientToUsage(defaultIngredient)}
    >
      {({ index, item, all, remove, replace }) => {
        const ingredient = getIngredient(item.id);
        const isDuplicated = all.some((x) => x !== item && x.id === item.id);

        if (!ingredient) {
          unkonwnEntity('ingrediente desconocido', item);
          remove();
          return null;
        }

        const units = getConversionsFor(ingredient.pkgUnit);
        item.cost = calculateIngredientCost(ingredient, item.amount, item.unit);

        return (
          <Grid
            key={index}
            gap="var(--chakra-space-2)"
            gridTemplate={[
              ` "name name name"
                "quantity cost remove"
                / 8fr 7fr auto`,
              ` "name quantity cost remove"
                / 1fr 8rem 7rem auto`,
            ]}
          >
            <IngredientControl
              gridArea="name"
              name={`ingredients.${index}.id`}
              as={Dropdown}
              // options is a property of Dropdown
              // Chakra knows that but for some reason typescript complains
              // @ts-ignore see above
              options={names}
              isInvalid={isDuplicated}
              onChange={(event) => {
                const newIngId = event.target.value as IngredientId;
                const newIng = getIngredient(newIngId);
                const newItem = ingredientToUsage(newIng);
                newItem.amount = item.amount;
                replace(index, newItem);
                focusNextInput(event);
              }}
            />

            <InputGroup gridArea="quantity">
              <IngredientControl
                name={`ingredients.${index}.amount`}
                as={NumberInput}
              />
              <InputRightElement width="4rem">
                <IngredientControl
                  name={`ingredients.${index}.unit`}
                  as={Dropdown}
                  // options is a property of Dropdown
                  // Chakra knows that but for some reason typescript complains
                  // @ts-ignore see above
                  options={units}
                  isDisabled={units.length === 1}
                />
              </InputRightElement>
            </InputGroup>

            <InputGroup gridArea="cost">
              <Input value={item.cost.toFixed(2)} isReadOnly />
              <InputRightAddon>€</InputRightAddon>
            </InputGroup>

            <DeleteButton
              gridArea="remove"
              label={`Quitar ${item.name}`}
              onConfirm={remove}
            />
          </Grid>
        );
      }}
    </FormList>
  );
}
