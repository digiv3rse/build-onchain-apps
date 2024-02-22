import Item from './Item';

export default function Vault() {
  return (
    <div className="w-full rounded-bl-xl bg-boat-color-gray-900 px-8 py-10">
      <h2 className="font-roboto mb-5 text-2xl">Vault</h2>

      <h3 className="font-roboto mb-1 text-lg">Weapons</h3>
      <div className="border-boat-gold border border-x-0 border-t-0" />

      <div className="my-4 flex gap-4">
        <Item src="/account_abstraction/sword.png" altText="Sword" active={false} />
        <Item src="/account_abstraction/shield.png" altText="Shield" active={false} />
        <Item src="/account_abstraction/bow_arrow.png" altText="Bow and Arrow" active={false} />
        <Item src="/account_abstraction/wing_suit.png" altText="Wing Suit" active={false} />
      </div>

      <h3 className="font-roboto mb-1 text-lg">Mystery boxes</h3>
      <div className="border-boat-gold border border-x-0 border-t-0" />

      <div className="my-4 flex gap-4">
        <Item src="/account_abstraction/mystery_box.png" altText="Mystery Box" />
        <div className="w-full" />
        <div className="w-full" />
        <div className="w-full" />
      </div>
    </div>
  );
}
