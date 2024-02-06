import { useMemo, useState } from 'react';
import { baseSepolia } from 'viem/chains';
import { useNetwork } from 'wagmi';
import { useCollectionMetadata } from '../../../onchainKit';
import NextImage from '../../components/NextImage/NextImage';
import { useCustom1155Contract } from '../../hooks/contracts';
import NotConnected from './NotConnected';
import MintProcessingStep from './steps/MintProcessingStep/MintProcessingStep';
import StartMintStep from './steps/StartMintStep/StartMintStep';
import SwitchNetwork from './SwitchNetwork';

export const EXPECTED_CHAIN = baseSepolia;

export enum MintSteps {
  START_MINT_STEP,
  MINT_PROCESSING_STEP,
}

export default function MintContractDemo() {
  const [mintStep, setMintStep] = useState<MintSteps | null>(null);

  const { chain } = useNetwork();

  const contract = useCustom1155Contract();

  const onCorrectNetwork = chain?.id === EXPECTED_CHAIN.id;

  const { collectionName, description, imageAddress, isLoading } = useCollectionMetadata(
    onCorrectNetwork,
    contract.status === 'ready' ? contract.address : undefined,
    contract.abi,
  );

  const mintContent = useMemo(() => {
    if (mintStep === MintSteps.MINT_PROCESSING_STEP) {
      return <MintProcessingStep />;
    }

    return <StartMintStep setMintStep={setMintStep} />;
  }, [mintStep]);

  if (contract.status === 'notConnected') {
    return <NotConnected />;
  }

  if (contract.status === 'onUnsupportedNetwork') {
    return <SwitchNetwork />;
  }

  if (isLoading) {
    // A future enhancement would be a nicer spinner here.
    return <span className="text-xl">loading...</span>;
  }

  // TODO: Retrieve this dynamically
  const ethAmount = 0.0001;

  return (
    <div className="my-10 gap-16 lg:my-20 lg:flex">
      <div className="w-full flex-shrink-0 flex-grow lg:max-w-[400px] xl:max-w-[600px]">
        <NextImage
          src={imageAddress}
          altText={collectionName}
          className="block w-full rounded-2xl"
        />
      </div>
      <div className="flex-shrink-1 mt-10 w-full flex-grow-0 lg:mt-0">
        <h1 className="text-4xl font-bold">{collectionName}</h1>

        <h2 className="my-5">{String(ethAmount)} ETH</h2>

        <p className="my-4 text-sm text-boat-footer-light-gray">{description}</p>

        {mintContent}
      </div>
    </div>
  );
}
