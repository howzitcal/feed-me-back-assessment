"use client";

import SentimentBadge from "@/components/app/SentimentBadge";
import SimplePage from "@/components/app/SimplePage";
import Tags from "@/components/app/Tags";
import {
  ButtonGroup,
  Center,
  Flex,
  Heading,
  IconButton,
  NativeSelect,
  Pagination,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { useRouter } from "next/navigation";

interface FeedbackData {
  sentiment: string;
  summary: string;
  tags: String[];
  priority: number;
  nextAction: string;
  model: string;
}

interface FeedbackResponseData {
  records: FeedbackData[];
  page: number;
  pageSize: number;
  total: number;
}

export default function FeedbackListPage() {
  const router = useRouter();
  const [feedbackData, setFeedbackData] = useState<FeedbackResponseData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [sort, setSort] = useState<string>("");

  const fetchFeedback = async () => {
    try {
      const res = await fetch(
        `/api/feedback?page=${page}&pageSize=${pageSize}&sortBy=${sort}`
      );
      const feedbackJson = await res.json();
      setFeedbackData(feedbackJson || {});
    } catch (e) {
      console.error(e);
      setError("Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchFeedback();
    })();
  }, [page, pageSize, sort]);

  useEffect(() => {
    console.log("here", feedbackData);
  }, [feedbackData]);

  if (loading) return <Center>Loading...</Center>;
  if (error) return <Center color="red.500">{error}</Center>;

  return (
    <SimplePage>
      <Stack width="full" gap="5">
        <Heading size="xl">Feedback</Heading>
        <Table.Root size="sm" variant="outline" bg="white">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Summary</Table.ColumnHeader>
              <Table.ColumnHeader onClick={() => setSort("sentiment")}>
                Sentiment
              </Table.ColumnHeader>
              <Table.ColumnHeader onClick={() => setSort("priority")}>
                Tags
              </Table.ColumnHeader>
              <Table.ColumnHeader onClick={() => setSort("priority")}>
                Priority
              </Table.ColumnHeader>
              <Table.ColumnHeader>Created At</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {feedbackData?.records &&
              feedbackData?.records.map((item: any) => {
                console.log(item);
                return (
                  <Table.Row
                    key={item._id}
                    onClick={() => router.push(`/feedback/${item._id}`)}
                  >
                    <Table.Cell>{item?.aiAnalytics?.summary}</Table.Cell>
                    <Table.Cell>
                      <SentimentBadge
                        sentiment={item?.aiAnalytics?.sentiment}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Tags items={item?.aiAnalytics?.tags} />
                    </Table.Cell>
                    <Table.Cell>{item?.aiAnalytics?.priority}</Table.Cell>
                    <Table.Cell>{item?.createdAt}</Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table.Root>

        <Pagination.Root
          page={page}
          count={feedbackData?.total}
          pageSize={feedbackData?.pageSize}
        >
          <Flex justifyContent="space-between">
            <ButtonGroup variant="ghost" size="sm" wrap="wrap">
              <Pagination.PrevTrigger asChild>
                <IconButton
                  onClick={() => {
                    setPage(page - 1);
                  }}
                >
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  <IconButton
                    variant={{ base: "ghost", _selected: "outline" }}
                    key={page.value}
                    onClick={() => setPage(page.value)}
                  >
                    {page.value}
                  </IconButton>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>

            <Flex>
              <Text textAlign={"center"} mr={2}>
                Items per page:
              </Text>
              <NativeSelect.Root w={20}>
                <NativeSelect.Field
                  bg="white"
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value))}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Flex>
          </Flex>
        </Pagination.Root>
      </Stack>
    </SimplePage>
  );
}
