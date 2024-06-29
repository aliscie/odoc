import * as React from 'react'
import Button from '@mui/material/Button'
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'

interface TestPopupProps {
    content: any
}

const TestPopup: React.FC<TestPopupProps> = (props)  => {
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

    const handleClipOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor ? null: event.currentTarget)
    }

    const open = Boolean(anchor)
    const id = open ? 'simple-popup' : undefined

    return (
        <div>
            <Button aria-describedby={id} variant='contained' onClick={handleClipOpen}>
                Open
            </Button>
            <BasePopup id={id} open={open} anchor={anchor}>
                {props.content}
            </BasePopup>
        </div>
    )
}

export default TestPopup