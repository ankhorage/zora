import { Badge, Button, Card, Input, Notice, Page, PageHeader, PageSection, Select, Textarea } from '@ankhorage/zora';

export default function ReservationsScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Reservations"
          description="Reserve a table, choose party size, and share visit notes."
          actions={<Button>Request table</Button>}
        />
      }
    >
      <PageSection title="Booking details" description="A reservation form composed from ZORA inputs.">
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
      </PageSection>

      <PageSection title="Availability">
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
      </PageSection>
    </Page>
  );
}
