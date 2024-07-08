import {describe, expect, it} from 'vitest';
import {addColumnUtils} from '../../units/addColumnUtils';
import {CColumn, Contract} from '../../../declarations/backend/backend.did';

const updateCustomContractColumns = (contract: Contract, columns: CColumn[], viewId: string): Contract => {
    
    return { ...contract, contracts: contract.contracts.map(c => c.id === viewId ? { ...c, columns } : c) };
};

const updateContract = (contract: Contract): void => {

};

describe("addColumnUtils", () => {
    it("should add a new column at the specified position", () => {
        const initialContract: Contract = {
            contracts: [
                {
                    id: "viewId",
                    columns: [],
                }
            ]
        }

        const newColumn = addColumnUtils(initialContract, "viewId", 0, updateCustomContractColumns, updateContract);
        
        //Assert
        expect(newColumn).toHaveProperty("id");
        expect(newColumn).toHaveProperty("field");
        expect(newColumn.headerName).toBe("Untitled");
        expect(newColumn.editable).toBe(true);
        expect(newColumn.deletable).toBe(true);
    });

    it("should throw an error if the contract is not found", ()=> {
        const initialContract: Contract = {
            contracts: [],
        };
        expect(()=> addColumnUtils(initialContract, "invalidViewId", 0, updateCustomContractColumns, updateContract))
    })
})
