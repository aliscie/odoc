export function normalize_files(files: any) {
    if (files.length == 0) {
        return []
    }

    return files[0].reduce((acc, file) => (acc[file[1].id] = file[1], acc), {})
}

