import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface AwaitingApprovalEmailProps {
  requesterUsername: string;
  mediaTitle: string;
  mediaType: 'Movie' | 'TV Show';
  reason: string;
  overseerrUrl: string; // e.g., 'http://localhost:5055'
  showTooManySeasonsText?: boolean;
}

export const AwaitingApprovalEmail = ({
  requesterUsername,
  mediaTitle,
  mediaType,
  reason,
  overseerrUrl,
  showTooManySeasonsText = false,
}: AwaitingApprovalEmailProps) => (
  <Html>
    <Head />
    <Preview>Your request is awaiting approval from your server admin.</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white font-sans">
        <Container className="mx-auto my-8 max-w-lg w-full rounded border border-solid border-gray-300 p-5">

          <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal text-black">
            Request Awaiting Approval
          </Heading>

          <Text className="text-sm leading-6 text-black">
            Hello {requesterUsername},
          </Text>
          <Text className="text-sm leading-6 text-black">
            Your request for <strong>{mediaTitle}</strong> cannot be auto-approved because: {reason}
          </Text>

          <Section className="my-6 rounded-md bg-gray-50 p-5 text-sm">
            <Text className="my-0">
              <strong>Media Title:</strong> {mediaTitle}
            </Text>
            <Text className="my-0">
              <strong>Media Type:</strong> {mediaType}
            </Text>
            <Text className="my-0">
              <strong>Status:</strong> Awaiting Admin Approval
            </Text>
          </Section>

          <Text className="text-sm leading-6 text-black">
            Your server admin has been notified and will review your request shortly.
          </Text>

          {showTooManySeasonsText && (
            <Text className="text-sm leading-6 text-black">
              You can edit your request to reduce the seasons that you want which might help get it automatically approved, depending on the season size.
            </Text>
          )}

          <Section className="mb-8 text-center">
            <Button
              className="rounded bg-purple-600 px-5 py-3 text-center text-xs font-semibold text-white no-underline inline-block"
              href={`${overseerrUrl}/requests`}
            >
              View Request Status
            </Button>
          </Section>

          <Text className="text-sm leading-6 text-black">
            You can check the status of your request anytime by visiting your Overseerr instance.
          </Text>

          <Hr className="mx-0 my-7 w-full border border-solid border-gray-300" />
          <Text className="text-xs leading-6 text-gray-600">
            This is an automated notification from your Overseerr instance.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default AwaitingApprovalEmail;