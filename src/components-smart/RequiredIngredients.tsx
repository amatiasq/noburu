import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  NumberInput,
} from '@chakra-ui/react';
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { bindControl } from '../components/Control';
import { Dropdown } from '../components/Dropdown';
import { FormList } from '../components/FormList';
import { Loading } from '../components/Loading';
import { useFireList } from '../hooks/useFireList';
import {
  calculateIngredientPrice,
  Ingredient,
  IngredientId,
} from '../model/Ingredient';
import { ingredientToRecipe } from '../model/Recipe';
import { getConversionsFor, Unit } from '../model/Unit';

export interface RequiredIngredient {
  id: IngredientId;
  name: string;
  cost: number;
  amount: number;
  unit: Unit;
}

export interface RequiredIngredientsProps {}

const IngredientControl = bindControl<
  RequiredIngredient,
  `ingredients.${number}.`
>();

export function RequiredIngredients({}: RequiredIngredientsProps) {
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
    <FormList<RequiredIngredient>
      name="ingredients"
      label="Ingredientes"
      addLabel="Añadir ingrediente"
      addItem={() => ingredientToRecipe(defaultIngredient)}
    >
      {({ index, item, remove }) => {
        const ingredient = getIngredient(item.id);

        if (!ingredient) {
          remove();
          return null;
        }

        const units = getConversionsFor(ingredient.pkgUnit);

        if (item.name !== ingredient.name) {
          item.name = ingredient.name;
          item.unit = ingredient.pkgUnit;
        }

        item.cost = calculateIngredientPrice(
          ingredient,
          item.amount,
          item.unit
        );

        return (
          <HStack key={index}>
            <IngredientControl
              name={`ingredients.${index}.id`}
              as={Dropdown}
              options={names}
              autoFocus
            />

            <InputGroup width="25rem">
              <IngredientControl
                name={`ingredients.${index}.amount`}
                as={NumberInput}
              />
              <InputRightElement width="4rem">
                <IngredientControl
                  name={`ingredients.${index}.unit`}
                  as={Dropdown}
                  options={units}
                  isDisabled={units.length === 1}
                />
              </InputRightElement>
            </InputGroup>

            <InputGroup>
              <Input value={item.cost.toFixed(2)} isReadOnly />
              <InputRightAddon>€</InputRightAddon>
            </InputGroup>

            <IconButton
              title="Quitar ingrediente"
              aria-label="Quitar ingrediente"
              icon={<FaTimes />}
              onClick={remove}
            />
          </HStack>
        );
      }}
    </FormList>
  );
}
