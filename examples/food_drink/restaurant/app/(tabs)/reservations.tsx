import {
  Badge,
  Card,
  Input,
  Notice,
  Screen,
  ScreenSection,
  Select,
  Textarea,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

export default function ReservationsScreen() {
  return (
    <>
      <ExampleAppBar title="Reservations" />
      <Screen>
        <ScreenSection
          title="Booking details"
          description="A reservation form composed from ZORA inputs."
        >
          <Input label="Date" placeholder="Friday, 24 May" />
          <Input label="Time" placeholder="19:30" />
          <Select
            label="Party size"
            placeholder="Choose guests"
            options={[
              { label: '2 guests', value: '2' },
              { label: '4 guests', value: '4' },
              { label: '6 guests', value: '6' },
            ]}
          />
          <Textarea placeholder="Dietary notes, stroller, celebration, or seating preference..." />
        </ScreenSection>

        <ScreenSection title="Availability">
          <Card
            title="Tonight"
            description="Tables available at 18:00, 19:30, and 21:00."
            actions={<Badge tone="success">Open slots</Badge>}
          />
          <Notice
            title="Static reservation flow"
            description="Calendar availability, confirmation emails, and table management belong in a later backend example."
            tone="primary"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
