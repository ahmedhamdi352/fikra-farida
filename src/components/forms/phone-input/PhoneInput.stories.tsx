import { Meta, StoryObj } from '@storybook/react';
import { FormWrap, PhoneInput } from 'components';

const meta = {
  title: 'Components/Forms/Text/PhoneInput',
  component: PhoneInput,
  decorators: [FormWrap],
} satisfies Meta<typeof PhoneInput>;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'default',
    label: 'Default',
  },
};

export const Loading: Story = {
  args: {
    name: 'default',
    label: 'Loading',
    loading: true,
  },
};

export const DefaultCountry: Story = {
  args: {
    name: 'default',
    label: 'default Country',
    defaultCountry: 'eg',
  },
};

export const DefaultMask: Story = {
  args: {
    name: 'defaultMask',
    label: 'default mask',
    defaultCountry: 'sa',
    defaultMask: '.. ... ....',
  },
};

export const DefaultMaskWithValidation: Story = {
  args: {
    name: 'defaultMaskWithValidation',
    label: 'SA mask with validation',
    defaultCountry: 'sa',
    defaultMask: '.. ... ....',
  },
};

export const DisableCountrySelection: Story = {
  args: {
    name: 'default',
    label: 'Disable Dropdown',
    disableDropdown: true,
  },
};

export const OnlyCountries: Story = {
  args: {
    name: 'default',
    label: 'only Countries',
    onlyCountries: ['sa', 'eg'],
  },
};

export const Disabled: Story = {
  args: {
    name: 'default',
    label: 'disabled',
    disabled: true,
  },
};
export default meta;
