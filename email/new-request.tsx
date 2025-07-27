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
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={LOGO_URL}
                width="40"
                height="37"
                alt="Overseerr Logo"
                className="mx-auto my-0"
              />
            </Section>
  
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Manual Attention Required
            </Heading>
  
            <Text className="text-[14px] leading-[24px] text-black">
              Hello Admin,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              A new media request from <strong>{requesterUsername}</strong> could
              not be processed automatically and requires your attention.
            </Text>
  
            <Section className="my-[24px] rounded-md bg-gray-50 p-[20px] text-[14px]">
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
  
            <Section className="mb-[32px] text-center">
              <Button
                className="rounded bg-[#553AF2] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`${overseerrUrl}/requests`}
              >
                Manage Request
              </Button>
            </Section>
  
            <Text className="text-[14px] leading-[24px] text-black">
              Please log in to your Overseerr instance to review and manually
              process this request.
            </Text>
  
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This is an automated notification from your Overseerr instance.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
  
  export default OverseerrManualRequestEmail;