import type { Meta, StoryObj } from '@storybook/react';
import { EventCard } from './EventCard';
import { events } from '@/data/mock';

const meta: Meta<typeof EventCard> = {
  title: 'Stagepass/EventCard',
  component: EventCard,
  args: {
    event: events[0],
    showApplyButton: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EventCard>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    event: events[1],
    showApplyButton: false,
  },
};
