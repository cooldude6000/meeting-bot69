import React from 'react'
import { Integration } from '../../hooks/useActionItems'
import ActionItemRow from './ActionItemRow'

interface ActionItemsListProps {
    actionItems: {
        id: number
        text: string
    }[]
    integrations: Integration[]
    loading: { [key: string]: boolean }
    addToIntegration: (platform: string, item: { id: number; text: string }) => void
    handleDeleteItem: (id: number) => void

}

function ActionItemsList(props: ActionItemsListProps) {
    return (
        <div className='space-y-4'>
            {props.actionItems.map((item) => (
                <ActionItemRow
                    key={item.id}
                    item={item}
                    integrations={props.integrations}
                    loading={props.loading}
                    addToIntegration={props.addToIntegration}
                    handleDeleteItem={props.handleDeleteItem}
                />
            ))}

        </div>
    )
}

export default ActionItemsList
