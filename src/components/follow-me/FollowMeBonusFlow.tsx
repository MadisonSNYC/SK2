/**
 * @fileoverview Follow Me bonus flow component
 * @module components/follow-me/FollowMeBonusFlow
 *
 * Manages the bonus question and details modal flow.
 * Extracted from FollowMeHelper.tsx to separate bonus tracking concerns.
 */

import type { BonusDetails } from '../../types';
import BonusModal from './BonusModal';
import BonusDetailsForm from './BonusDetailsForm';

interface FollowMeBonusFlowProps {
  showBonusModal: boolean;
  showBonusDetailsForm: boolean;
  roundsCompleted: number;
  onBonusYes: () => void;
  onBonusNo: () => void;
  onBonusDetailsSave: (details: BonusDetails) => void;
  onBonusDetailsSkip: () => void;
}

export default function FollowMeBonusFlow({
  showBonusModal,
  showBonusDetailsForm,
  roundsCompleted,
  onBonusYes,
  onBonusNo,
  onBonusDetailsSave,
  onBonusDetailsSkip,
}: FollowMeBonusFlowProps) {
  return (
    <>
      {/* Step 1: Did bonus trigger? Yes/No */}
      <BonusModal
        isOpen={showBonusModal}
        roundsCompleted={roundsCompleted}
        onYes={onBonusYes}
        onNo={onBonusNo}
      />

      {/* Step 2: If yes, collect bonus details */}
      <BonusDetailsForm
        isOpen={showBonusDetailsForm}
        onSave={onBonusDetailsSave}
        onSkip={onBonusDetailsSkip}
      />
    </>
  );
}
