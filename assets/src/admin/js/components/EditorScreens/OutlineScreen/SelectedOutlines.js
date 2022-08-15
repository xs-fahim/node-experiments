import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const { useState, useRef } = wp.element
import { GenieMapProps } from "../../../map-props";
import { Button, Dropdown, Menu } from "antd";

const SelectedOutlines = GenieMapProps(({ getInputs, setInput }) => {
    const [editableText, setEditableText] = useState('');
    const [inputVal, setInputVal] = useState('');
    const outlineRef = useRef(null);
    /**
     * check if any outline is selected and then make the array of unique values
     * if selectedOutline is not defined yet then assign empty array
     */
    const selectedOutlines = getInputs['selectedOutlines'] ? [...(new Set(getInputs['selectedOutlines']))] : []

    /**
     * @function handleEditedText
     * @param {event} e value  event properties of edited item
     * @param {number} index index of the edited item
     */
    const handleEditedText = (e, index) => {
        if (e.type === 'keyup' && (e.key !== 'Enter' || e?.which !== 13)) {
            setInputVal(e.target.value)
            return
        }

        let items = [...selectedOutlines];
        items[index] = inputVal
        /** filter out empty strings if exist */
        items = items.filter(Boolean)
        /** update outline value with new one */
        setInput('selectedOutlines', items)
        setEditableText('')

        if (e.type === 'keyup') {
            setInputVal('')
        }
    }

    /** 
     * @function
     * @param {array} result re-ordered outline list
     * @description takes updated list re-ordered by dragging
     */
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(selectedOutlines);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setInput('selectedOutlines', items)
        /** visible add outline button after dragging finished */
        outlineRef.current.style.visibility = 'visible';

    }
    const handleDragStart = e => {
        /** hide add outline button while dragging */
        outlineRef.current.style.visibility = 'hidden';
    }
    const handleEditOutline = text => {
        setEditableText(text)
        setInputVal(text)
    }
    const handleDeleteOutline = text => {
        let items = [...selectedOutlines];
        if (items.indexOf(text) != -1) {
            items.splice(items.indexOf(text), 1)
        }

        setInput('selectedOutlines', items)
    }
    const menu = (text) => {
        return (
            <Menu className='getgenie-outline-menu'>
                <Menu.Item key="0">
                    <Button type='text' onClick={() => handleEditOutline(text)}>
                        <span className="getgenie-icon-edit icon"></span>
                        Edit</Button>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button type='text' onClick={() => handleDeleteOutline(text)}>
                        <span className="getgenie-icon-delete icon"></span>
                        Delete</Button>
                </Menu.Item>
            </Menu>
        )
    }

    const addOutline = () => {
        /** add an empty string item to the list so that textarea will appear as blank */
        setInput('selectedOutlines', [...selectedOutlines, '']);
    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd} onBeforeDragStart={handleDragStart}>
            <Droppable droppableId="droppable">
                {(provided => (
                    <div className="getgenie-card" {...provided.droppableProps}
                        ref={provided.innerRef}>
                        {
                            selectedOutlines.map((item, index) => <Draggable key={index + 1}
                                draggableId={`${index}-1`} index={index}
                            >
                                {(provided) => (
                                    <div {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef} className={`getgenie-single-outline ${editableText === item ? 'outline-input' : 'outline-content'}`}>
                                        <div className="getgenie-outline-cards-content">
                                            {editableText === item ?
                                                <textarea
                                                    autoFocus
                                                    onFocus={e => e.target.selectionStart = item.length}
                                                    onBlur={e => handleEditedText(e, index)}
                                                    className='getgenie-outline-cards-input'
                                                    defaultValue={item}
                                                    onKeyUp={e => handleEditedText(e, index)}
                                                ></textarea>
                                                :
                                                <>
                                                    <h5 onDoubleClick={() => handleEditOutline(item)} className='generated-content'>{item}</h5>
                                                    <Dropdown overlay={menu(item)} trigger={['click']}>
                                                        <Button type='text' className="getgenie-outline-cards-menuBtn"><span className="getgenie-icon-more"></span></Button>
                                                    </Dropdown>
                                                </>
                                            }
                                        </div>
                                    </div>
                                )}
                            </Draggable>)
                        }

                    </div>
                )
                )}
            </Droppable>
            <Button ref={outlineRef} onClick={addOutline} type="primary" className="add-outline-btn">
                Add Outline</Button>
        </DragDropContext >
    )
}, ['getInputs', 'setInput']);

export { SelectedOutlines }