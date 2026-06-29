/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { format, isEqual } from "date-fns";
import Image from "next/image";
import React, { FC, useRef, useState } from "react";
import DeleteIcon from "../../icons/Delete";
import EditIcon from "../../icons/Edit";
import ThreeDotsIcon from "../../icons/ThreeDots";
import Button from "../../button";
import { useClickOutside } from "@/hooks/useClickOutside";
import ConfirmationModal from "../../modal/ConfirmationModal";

type Props = {
  comment: TComment;
  editHandler: (id: number) => void;
  deleteHandler: (id: number) => void;
};

const Comment: FC<Props> = ({ comment, editHandler, deleteHandler }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [openActions, setOpenActions] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const toggleActionsHandler = () => {
    setOpenActions((p) => !p);
  };

  const closeActionsHandler = () => {
    setOpenActions(false);
  };

  const pozitiveConfirmationHandler = () => {
    deleteHandler(comment.id);
    setShowDeleteConfirmModal(false);
  };

  const negativeConfirmationHandler = () => {
    setShowDeleteConfirmModal(false);
  };

  useClickOutside(ref, closeActionsHandler);

  // const replyComment = c.replyCommentId
  //   ? MOCK_COMMENTS.find((c2) => c2.id === c.replyCommentId)
  //   : null;

  return (
    <>
      {/* {replyComment && (
        <div className="flex">
          <div className="w-8 h-6 pl-[10px] pr-1 flex items-end">
            <div className="w-full h-1/2 rounded-tl border-t border-l border-greyPrimary"></div>
          </div>
          <div className="w-6 h-6 rounded-full bg-darkPrimary/50"></div>
          <p className="ml-2 text-sm font-bold text-nowrap text-darkPrimary/50">
            {replyComment.name}
          </p>
          <div className="ml-2 flex text-nowrap text-ellipsis overflow-hidden text-darkPrimary/50">
            {replyComment.content}
          </div>
        </div>
      )} */}
      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        title="Are you sure you want to delete this comment?"
        subTitle="This comment will be permanently deleted"
        pozitiveHandler={pozitiveConfirmationHandler}
        negativeHandler={negativeConfirmationHandler}
      />
      <div
        key={comment.id}
        className="group/comment relative w-full flex items-start gap-2"
      >
        {openActions && (
          <div
            ref={ref}
            className="absolute z-50 top-0 right-7 py-2 px-2 flex items-center gap-2 bg-white rounded border border-greyLight shadow-primary"
          >
            <div onClick={() => editHandler(comment.id)}>
              <EditIcon className="w-4 h-4 cursor-pointer transition-all stroke-greyPrimary/70 hover:stroke-greyPrimary" />
            </div>
            <div onClick={() => setShowDeleteConfirmModal(true)}>
              <DeleteIcon className="w-4 h-4 cursor-pointer transition-all stroke-redPrimary/70 hover:stroke-redPrimary" />
            </div>
          </div>
        )}
        <div className="w-6 h-6 rounded-full overflow-hidden bg-darkPrimary">
          {comment.author.avatar && (
            <Image
              className="w-full h-full object-cover"
              width={24}
              height={24}
              src={comment.author.avatar}
              alt={comment.author.first_name}
            />
          )}
        </div>
        <div className="pt-[2px]">
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold">
              {comment.author.first_name} {comment.author.last_name}
            </p>
            <p className="text-xs text-greyPrimary">
              {format(comment.updated_at, "dd MMM")}{" "}
              {!isEqual(comment.created_at, comment.updated_at) && (
                <span className="ml-1 text-xs">Updated</span>
              )}
            </p>
          </div>
          <div className="mt-1">{comment.body}</div>
        </div>
        <Button
          variant="resting-active"
          className="w-6 h-6 p-1 ml-auto mb-auto cursor-pointer hidden group-hover/comment:block"
          onClick={toggleActionsHandler}
        >
          <ThreeDotsIcon className="fill-greyPrimary" />
        </Button>
      </div>
    </>
  );
};

export default Comment;
