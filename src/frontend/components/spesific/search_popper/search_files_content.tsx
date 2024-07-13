import {useSelector} from "react-redux";
import {ContentNode, FileNode} from "../../../../declarations/backend/backend.did";

function useSearchFiles() {
    const {files} = useSelector((state: any) => state.filesReducer);

    const {denormalized_files_content}: { denormalized_files_content: [] | [Array<[string, Array<[string, ContentNode]>]>] } = useSelector((state: any) => state.filesReducer);

    //
    // We need this to reduce the calls for the canisters because they also can cost scyles in the future.
    // when user click load more call actor.search_files_content(searchValue, true);
    // When the results are empty also call actor.search_files_content(searchValue, true);

    // Search in the content.text.contains(search_value) and  return just file id
    function SearchFilesContent(search_value: string, case_sensitive: boolean): [string] | undefined {
        if (denormalized_files_content.length === 0) return undefined;
        const files_content = denormalized_files_content[0];
        const search_res: [string] = [];
        for (let i = 0; i < files_content.length; i++) {
            const file_content = files_content[i];
            const file_id = file_content[0];
            const content = file_content[1];
            for (let j = 0; j < content.length; j++) {
                const content_node = content[j];
                const content_text = content_node.text;
                if (case_sensitive) {
                    if (content_text.includes(search_value)) {
                        search_res.push(file_id);
                        break;
                    }
                } else {
                    if (content_text.toLowerCase().includes(search_value.toLowerCase())) {
                        search_res.push(file_id);
                        break;
                    }

                }
            }
        }
        return search_res;
    }

    function SearchFilesTitles(search_value: string, case_sensitive: boolean): [string] | undefined {
        let res = []
        Object.values(files).forEach((file: FileNode) => {
            if (file.name.includes(search_value) && case_sensitive) {
                res.push(file.id)
            } else if (file.name.toLowerCase().includes(search_value.toLowerCase()) && !case_sensitive) {
                res.push(file.id)
            }
        })
        return res
    }

    return {SearchFilesContent, SearchFilesTitles};

}

export default useSearchFiles;