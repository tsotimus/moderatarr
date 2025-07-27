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
  
  interface OverseerrManualRequestEmailProps {
    requesterUsername: string;
    requesterEmail?: string;
    mediaTitle: string;
    mediaType: 'Movie' | 'TV Show';
    overseerrUrl: string; // e.g., 'http://localhost:5055'
  }
  
  const LOGO_URL =
    'https://raw.githubusercontent.com/sct/overseerr/develop/public/logo.png';
  
  export const OverseerrManualRequestEmail = ({
    requesterUsername,
    requesterEmail,
    mediaTitle,
    mediaType,
    overseerrUrl,
  }: OverseerrManualRequestEmailProps) => (
    <Html>
      <Head />
      <Preview>Manual action required for a new Overseerr request.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-8 max-w-lg w-full rounded border border-solid border-gray-300 p-5">
            <Section className="mt-8">
              <Img
                src={LOGO_URL}
                width="auto"
                height="auto"
                alt="Overseerr Logo"
                className="mx-auto my-0 w-10 h-auto"
              />
            </Section>
  
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal text-black">
              Manual Attention Required
            </Heading>
  
            <Text className="text-sm leading-6 text-black">
              Hello Admin,
            </Text>
            <Text className="text-sm leading-6 text-black">
              A new media request from <strong>{requesterUsername}</strong> could
              not be processed automatically and requires your attention.
            </Text>
  
            <Section className="my-6 rounded-md bg-gray-50 p-5 text-sm">
              <Text className="my-0">
                <strong>Media Title:</strong> {mediaTitle}
              </Text>
              <Text className="my-0">
                <strong>Media Type:</strong> {mediaType}
              </Text>
              <Text className="my-0">
                <strong>Requested By:</strong> {requesterUsername}{' '}
                {requesterEmail && `(${requesterEmail})`}
              </Text>
            </Section>
  
            <Section className="mb-8 text-center">
              <Button
                className="rounded bg-purple-600 px-5 py-3 text-center text-xs font-semibold text-white no-underline inline-block"
                href={`${overseerrUrl}/requests`}
              >
                Manage Request
              </Button>
            </Section>
  
            <Text className="text-sm leading-6 text-black">
              Please log in to your Overseerr instance to review and manually
              process this request.
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
  
  export default OverseerrManualRequestEmail;