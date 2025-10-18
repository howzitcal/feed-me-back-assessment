import { MongooseError } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { connectDB } from "../db/mongo";
import { isObject } from "../helpers";
import { OpenAIError } from "openai";
import { v4 } from "uuid";
import pino from "pino";

const traceId = v4();

export const getLogger = () => {
  return pino({
    level: process.env.LOG_LEVEL || "info",
    formatters: {
      log: (object) => {
        return {
          ...object,
          traceId: traceId || "",
        };
      },
    },
  });
};

export const requestWrapper = (
  handler: (
    req: NextRequest,
    { params }: { params: Promise<any> }
  ) => Promise<Response> | Response
) => {
  return async (req: NextRequest, { params }: { params: Promise<any> }) => {
    try {
      const logger = getLogger();
      logger.info(req.url);
      await connectDB();
      return await handler(req, { params });
    } catch (error) {
      return handleError(error, req);
    }
  };
};

const handleError = (error: unknown, req: NextRequest): NextResponse => {
  const logger = getLogger();
  logger.error(error);

  const errorValidators = [
    validateForZodError,
    validateForMongooseError,
    validateForOpenAIError,
  ];
  let userErrorObject = null;

  for (let i = 0; i < errorValidators.length; i++) {
    const errorValidator = errorValidators[i];
    const errorValidatorResult = errorValidator(error);
    if (errorValidatorResult != undefined && isObject(errorValidatorResult)) {
      userErrorObject = errorValidatorResult;
      break;
    }
  }

  if (userErrorObject) {
    return NextResponse.json(userErrorObject, {
      status: 400,
    });
  } else {
    return NextResponse.json({ errorMessage: "Server Error" }, { status: 500 });
  }
};

const validateForZodError = (error: unknown) => {
  if (error instanceof ZodError) {
    return {
      errorMessage: "Validation failed",
      errors: error.issues.map(({ path, message }) => ({ path, message })),
    };
  }
};

const validateForMongooseError = (error: unknown) => {
  if (error instanceof MongooseError) {
    return {
      errorMessage: "Request Failed.",
    };
  }
};

const validateForOpenAIError = (error: unknown) => {
  if (error instanceof OpenAIError) {
    return {
      errorMessage: "Request Failed.",
    };
  }
};
