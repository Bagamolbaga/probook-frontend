import {
  useCreateBookingCommentQuery,
  useDeleteBookingCommentQuery,
  useGetBookingCommentsQuery,
  useUpdateBookingCommentQuery,
} from "@/api/queries/booking/comment";
import Button from "@/components/ui/button";
import CommentsListEmptyIcon from "@/components/ui/icons/CommentsListEmpty";
import TextField from "@/components/ui/inputs/TextField";
import Spinner from "@/components/ui/loaders/Spinner";
import { toaster } from "@/components/ui/toaster";
import Comment from "@/components/ui/widgets/comment";
import { differenceInSeconds } from "date-fns";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  bookingId: number;
};

const Comments = ({ bookingId }: Props) => {
  const t = useTranslations();

  const {
    handleSubmit: handleSubmitComment,
    register: registerComment,
    formState: formStateComment,
    reset: resetComment,
    setValue: setValueComment,
    getValues: getValuesComment,
  } = useForm<{
    comment: string;
    editCommentId: number | null;
  }>({
    defaultValues: {
      editCommentId: null,
    },
  });

  const getBookingCommentsQuery = useGetBookingCommentsQuery({
    bookingId,
  });
  const createBookingCommentQuery = useCreateBookingCommentQuery();
  const updateBookingCommentQuery = useUpdateBookingCommentQuery();
  const deleteBookingCommentQuery = useDeleteBookingCommentQuery();

  const handleEditComment = (commentId: number) => {
    setValueComment("editCommentId", commentId);
    setValueComment(
      "comment",
      getBookingCommentsQuery?.data?.results.find((c) => c.id === commentId)?.body || ""
    );
  };

  const createCommentHandler = async (formData: {
    comment: string;
    editCommentId: number | null;
  }) => {
    try {
      if (formData.comment) {
        await createBookingCommentQuery.mutateAsync({
          bookingId,
          data: {
            body: formData.comment,
            body_thai: formData.comment,
          },
        });

        toaster.success("Created comment success");
      }
    } catch (error) {
      toaster.error("Something went wrong");
    } finally {
      resetComment({ comment: "", editCommentId: null });
    }
  };

  const updateCommentHandler = async (formData: {
    comment: string;
    editCommentId: number | null;
  }) => {
    try {
      if (formData.comment && formData.editCommentId) {
        await updateBookingCommentQuery.mutateAsync({
          commentId: formData.editCommentId,
          data: {
            body: formData.comment,
            body_thai: formData.comment,
          },
        });

        toaster.success("Updated comment success");
      }
    } catch (error) {
      toaster.error("Something went wrong");
    } finally {
      resetComment({ comment: "", editCommentId: null });
    }
  };

  const deleteCommentHandler = async (commentId: number) => {
    try {
      await deleteBookingCommentQuery.mutateAsync({
        commentId,
        bookingId,
      });

      toaster.success("Deleted comment success");
    } catch (error) {
      toaster.error("Something went wrong");
    } finally {
      resetComment({ comment: "", editCommentId: null });
    }
  };

  const mainActionHandler = (formData: {
    comment: string;
    editCommentId: number | null;
  }) => {
    if (getValuesComment("editCommentId")) {
      void updateCommentHandler(formData);
    } else {
      void createCommentHandler(formData);
    }
  };

  const comments = useMemo(() => {
    if (getBookingCommentsQuery.data?.results) {
      return getBookingCommentsQuery.data.results;
    }

    return [];
  }, [getBookingCommentsQuery.data]);

  const isLoading = getBookingCommentsQuery.isLoading;

  return (
    <div>
      <div className="px-6">
        <p className="text-lg font-bold">{t("bookingManagement.form.commets.title")}</p>
        {isLoading && (
          <div className="h-20 flex flex-col items-center justify-center">
            <Spinner />
          </div>
        )}
        {!isLoading && comments.length ? (
          <div className="mt-4 flex flex-col items-start gap-3">
            {comments
              .sort((a, b) => differenceInSeconds(a.created_at, b.created_at))
              .map((c) => (
                <Comment
                  key={c.id}
                  comment={c}
                  editHandler={handleEditComment}
                  deleteHandler={deleteCommentHandler}
                />
              ))}
          </div>
        ) : null}
        {!isLoading && !comments.length && (
          <div className="h-[calc(100%-30px)] flex flex-col items-center justify-center">
            <CommentsListEmptyIcon />
            <p className="mt-2 text-sm text-greyPrimary">
              {t("bookingManagement.form.commets.emptyText")}
            </p>
          </div>
        )}
      </div>

      <div className="w-full mt-5 px-6 py-2 flex items-center justify-between gap-5 bg-greyBackgroundLight">
        <div className="w-full">
          <TextField
            className="mb-2 !py-1"
            placeholder={t("bookingManagement.form.commets.form.placeholder")}
            id="comment"
            requiredHideSymbol
            register={registerComment}
            error={formStateComment.errors.comment}
            rules={{
              required: true,
              maxLength: 1000,
            }}
          />
        </div>
        <div className="flex items-center">
          <Button variant="primary" onClick={handleSubmitComment(mainActionHandler)}>
            {t("bookingManagement.form.commets.form.sendBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
