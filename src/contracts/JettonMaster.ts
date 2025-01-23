import { Address, Contract, ContractProvider, beginCell } from '@ton/core';

export class JettonMaster implements Contract {
    constructor(readonly address: Address) {}

    static createFromAddress(address: Address) {
        return new JettonMaster(address);
    }

    async getJettonData(provider: ContractProvider) {
        const { stack } = await provider.get('get_jetton_data', []);
        const totalSupply = stack.readBigNumber();
        const mintable = stack.readBoolean();
        const adminAddress = stack.readAddress();
        const content = stack.readCell();

        return {
            totalSupply,
            mintable,
            adminAddress,
            content
        };
    }

    async getWalletAddress(provider: ContractProvider, ownerAddress: Address) {
        const { stack } = await provider.get('get_wallet_address', [
            { type: 'slice', cell: beginCell().storeAddress(ownerAddress).endCell() }
        ]);
        return stack.readAddress();
    }
} 