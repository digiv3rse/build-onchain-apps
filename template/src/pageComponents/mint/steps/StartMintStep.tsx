import { useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { TransactionExecutionError } from 'viem';
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import Button from '../../../components/Button/Button';
import { EXPECTED_CHAIN } from '../../../constants';
import { useCustom1155Contract } from '../../../hooks/contracts';
import { MintSteps } from '../ContractDemo';
import MintCompleteStep from './MintCompleteStep';
import MintProcessingStep from './MintProcessingStep';
import OutOfGasStep from './OutOfGasStep';

type StartMintProps = {
  setMintStep: React.Dispatch<React.SetStateAction<MintSteps>>;
  mintStep: MintSteps;
  collectionName: string | null;
};

export default function StartMintStep({ setMintStep, mintStep, collectionName }: StartMintProps) {
  const { chain } = useAccount();
  const { address } = useAccount();

  const contract = useCustom1155Contract();

  const onCorrectNetwork = chain?.id === EXPECTED_CHAIN.id;

  const { data: mintData } = useSimulateContract({
    address: contract.status === 'ready' ? contract.address : undefined,
    abi: contract.abi,
    functionName: 'mint',
    args: address ? [address, BigInt(1), BigInt(1), address] : undefined,
    query: {
      enabled: onCorrectNetwork,
    },
  });

  const {
    writeContract: performMint,
    error: errorMint,
    data: hash,
    status: mintWriteStatus,
  } = useWriteContract();

  const { status: transactionStatus, isLoading: isLoadingTranasaction } =
    useWaitForTransactionReceipt({
      hash,
      query: {
        enabled: !!hash,
      },
    });

  useEffect(() => {
    if (transactionStatus === 'success') {
      setMintStep(MintSteps.MINT_COMPLETE_STEP);
    }

    if (errorMint) {
      const isOutOfGas =
        errorMint instanceof TransactionExecutionError &&
        errorMint.message.toLowerCase().includes('out of gas');
      setMintStep(isOutOfGas ? MintSteps.OUT_OF_GAS_STEP : MintSteps.START_MINT_STEP);
    }
  }, [transactionStatus, setMintStep, errorMint]);

  const handleMint = useCallback(() => {
    if (mintData?.request) {
      performMint?.(mintData?.request);
      setMintStep(MintSteps.MINT_PROCESSING_STEP);
    }
  }, [mintData, performMint, setMintStep]);

  return (
    <>
      {mintStep === MintSteps.MINT_PROCESSING_STEP && <MintProcessingStep />}
      {mintStep === MintSteps.OUT_OF_GAS_STEP && <OutOfGasStep setMintStep={setMintStep} />}
      {mintStep === MintSteps.MINT_COMPLETE_STEP && (
        <MintCompleteStep setMintStep={setMintStep} collectionName={collectionName} />
      )}

      {mintStep === MintSteps.START_MINT_STEP && (
        <Button
          buttonContent="Mint"
          onClick={handleMint}
          disabled={!onCorrectNetwork}
          className={clsx('my-4', onCorrectNetwork ? 'bg-white' : 'bg-gray-400')}
          loading={mintWriteStatus === 'pending' || isLoadingTranasaction}
        />
      )}
    </>
  );
}
