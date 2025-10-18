## Technology stack choices

NextJS with TS: seemed like an easy win to get a BE/FE in javascript
Mongoose as the ORM + MongoDB: NoSQL is easy to setup and store sub documents in
Service like objects in `@/lib/ai` for general AI
Testing : JEST (failed)

## AI prompt engineering considerations and safety measures

Prompt was given the desire outcome data structure It was also told not to leak PII
in the future it could also use :https://www.npmjs.com/package/@coffeeandfun/remove-pii as a further measure.

## Data model choices (relational vs non-relational) and rationale

Great for storing large amounts of data efficiently, as we are a company that gets a lot of feedback we need that, it's also very easy to quickly modify the data structures to implement new features.

## OpenAI vs Anthropic:

I made the choice to use OpenAI because they had great documentation, they also integrated some features that looked promising like using a Zod Schema to ensure the output is in the correct format, however that feature does not seems to work, even after trying their code sample it never ran, OpenAI also has a cheaper model with gpt 4.1 nano at ~0.2 USD / million input tokens.

## Moving the AI Analysis out of the call pattern

This would be better suited as a periodic task that runs 1/4 hourly, fetches all records that do not have an AI analysis, and bulk processes them. This would mean that the user gets a better experience (one less 3rd party API call) and allows us to have more control of the Analysis processing.

## AI rate limit or timeout errors

We would have to see if why we are making too many calls to the API, see if there is a way to consolidate the calls (bulk queries) a potentially troublesome solution would be to increase the back off times to ensure that we are not going over the API's request/minute limit

## Database connection exhaustion or connectivity issues

We would need to ensure that we are not making unnecessary queries, we would also need to see if the connection pool needs to be expanded as well as ensure that we are closing connections where queries are complete.

## Which of caching or retries you implemented and why

I chose lightweight retried with back off times, because I know how that works, I have never heard of hashing test for cache analysis. It is something I am going to look in to.

## Testing strategy and key scenarios

My plan was to use jest, mock the OpenAI client and key functions and throw strategic errors to ensure that the code would behave as expected, I also wanted to create simple snapshots for the FE and a simple form submission for the feedback form.

## describing the design and trade‑offs you made

I am proud of the backend, there are some trade offs that I made to save time. The error handling could be better, with more in depth logging.
However the Frontend sucks in my opinion, the sort only sorts ascending, the form page could have been written better. This was also my first attempt as a NextJS app with Typescript, after this my opinion on TS remains the same, great for huge project like writing VSCode, I really feel like it does not belong in web development.

I did not complete the assessment due to the fact that I could not get the testing working.

Thank you for the opportunity, I learned a lot.
