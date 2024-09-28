import * as React from 'react';
import { Html, Button, Head, Row, Text } from "@react-email/components";


interface verificationEmailProps {
    username: string;
    otp: string;
}

export function VerificationEmail({username, otp}: verificationEmailProps) {
 

  return (
    <Html lang="en">
      <Head>
        <title> Verification Code</title>
      </Head>
      <Row>
        <Text>Hi {username}</Text>
      </Row>
      <Row>
        <Text>{otp}</Text>
      </Row>
    </Html>
  );
}

export default verificationEmailProps;
