"use client";

import SimplePage from "@/components/app/SimplePage";
import UserDialog from "@/components/app/UserDialog";
import {
  Button,
  Center,
  Field,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function FeedbackSubmissionPage() {
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    email: "",
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [dialogProps, setDialogProps] = useState({
    title: "",
    body: "",
    open: false,
  });

  const updateFormData = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const errors: { [key: string]: string } = {};

    if (!formData.text) errors.text = "Feedback is required";

    if (formData?.email?.length == 0) {
      console.log("removing email");
      delete formData.email;
    }

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const result = await response.json();
      setDialogProps({
        title: "Thank you",
        body: "Feedback submitted.",
        open: true,
      });

      setFormData({ email: "", text: "" });
    } catch (error) {
      setDialogProps({
        title: "Failed to submit feedback",
        body: "Please try again.",
        open: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Center h="100vh">
        <SimplePage>
          <VStack py={4} spacing={4}>
            <Text textStyle="2xl">💬 Customer Feedback:</Text>
            <Text textStyle="md" textAlign={"center"}>
              Compliments, complaints, and suggestions — we want to hear you!
            </Text>

            <Field.Root invalid={!!formErrors.email}>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                bg={"white"}
                placeholder="joe@dirt.com"
                value={formData.email || ""}
                onChange={(e) => updateFormData("email", e.target.value)}
              />
              <Field.ErrorText>{formErrors.email}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!formErrors.text}>
              <Field.Label>Feedback</Field.Label>
              <Textarea
                bg="white"
                h={200}
                placeholder="Your feedback..."
                value={formData.text || ""}
                onChange={(e) => updateFormData("text", e.target.value)}
              />
              <Field.ErrorText>{formErrors.text}</Field.ErrorText>
            </Field.Root>

            <Button
              size="lg"
              bg="green.500"
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              Submit feedback
            </Button>
          </VStack>
        </SimplePage>
      </Center>

      <UserDialog
        {...dialogProps}
        onConfirm={() => setDialogProps((s) => ({ ...s, open: false }))}
      />
    </>
  );
}
