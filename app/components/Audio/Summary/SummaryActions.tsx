import React, { useState } from 'react';
import SummarizeButton from './SummarizeButton';
import SummarizeModal from '@/app/components/Audio/Summary/SummarizeModal'; // This will be your trigger for the modal

const SummaryActions = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SummarizeButton onOpenModal={handleOpenModal} />
      <SummarizeModal open={isModalOpen} handleClose={handleCloseModal} />
    </>
  );
};

export default SummaryActions;
