import React from 'react';
import { Modal, Button, Placeholder } from '@telegram-apps/telegram-ui';
import { FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';

interface Task {
  id: string;
  description: string;
  reward: number;
  completed: boolean;
  requiredMiningLevel?: number;
  requiredBalance?: number;
  requiredScorpions?: number;
  socialVerificationSteps?: string[];
  type?: 'social' | 'in-game';
  platform?: string;
  link?: string;
}

interface TaskModalProps {
  task: Task;
  onClaimReward: (taskId: string) => void;
  miningLevel: number;
  balance: number;
  isVerifying: boolean;
  loadingTaskId: string | null;
  onSocialAction: (taskId: string, action: string) => void;
  socialTaskProgress: { [key: string]: boolean };
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  onClaimReward,
  miningLevel,
  balance,
  isVerifying,
  onSocialAction,
  socialTaskProgress,
}) => {
  const canClaimReward = () => {
    if (task.type === 'social') {
      return task.socialVerificationSteps?.every((step) => socialTaskProgress[`${task.id}_${step}`]) || false;
    } else {
      return (
        (!task.requiredMiningLevel || miningLevel >= task.requiredMiningLevel) &&
        (!task.requiredBalance || balance >= task.requiredBalance) &&
        (task.requiredScorpions ? task.requiredScorpions <= (task.requiredScorpions || 0) : true)
      );
    }
  };

  return (
    <Modal
      header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Task Instructions</ModalHeader>}
      trigger={
        <Button
          disabled={task.completed}
          onClick={() => {}}
          size="m"
          color={task.completed ? 'secondary' : 'primary'}
        >
          {task.completed ? 'Done' : 'Start'}
        </Button>
      }
    >
      <Placeholder description={task.description} header="Task Instructions">
        <div className="space-y-4">
          {task.type === 'social' && (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-[#f48d2f]">1.</span>
                <p className="text-sm">Complete the following steps:</p>
              </div>
              {task.socialVerificationSteps?.map((step) => (
                <div key={step} className="flex items-center space-x-2">
                  <Button
                    onClick={() => onSocialAction(task.id, step)}
                    disabled={socialTaskProgress[`${task.id}_${step}`]}
                    size="s"
                    color={socialTaskProgress[`${task.id}_${step}`] ? 'secondary' : 'primary'}
                  >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </Button>
                  <p className="text-sm">{`${step.charAt(0).toUpperCase() + step.slice(1)} on ${task.platform}`}</p>
                  {socialTaskProgress[`${task.id}_${step}`] && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              ))}
              <div className="flex items-center">
                <a
                  href={task.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline flex items-center"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  Go to {task.platform}
                </a>
              </div>
            </>
          )}

          {task.type === 'in-game' && (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-[#f48d2f]">1.</span>
                <p className="text-sm">Requirements:</p>
              </div>
              <ul className="list-disc list-inside text-sm">
                <li>Mining Level: {task.requiredMiningLevel || 'N/A'} (Your level: {miningLevel})</li>
                <li>Balance: {task.requiredBalance || 'N/A'} (Your balance: {balance})</li>
                <li>Scorpions Caught: {task.requiredScorpions || 'N/A'} (Your caught: {0})</li>
              </ul>
            </>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-[#f48d2f]">{task.type === 'social' ? '2.' : '1.'}</span>
            <p className="text-sm">Claim your reward once all steps are complete:</p>
          </div>

          <center>
            <Button
              disabled={task.completed || !canClaimReward() || isVerifying}
              onClick={() => onClaimReward(task.id)}
              size="l"
              color={task.completed ? 'secondary' : canClaimReward() ? 'primary' : 'secondary'}
            >
              {task.completed ? 'Done' : isVerifying ? (
                <div className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Verifying...
                </div>
              ) : 'Claim Task Reward'}
            </Button>
          </center>
        </div>
      </Placeholder>
    </Modal>
  );
};

export default TaskModal;