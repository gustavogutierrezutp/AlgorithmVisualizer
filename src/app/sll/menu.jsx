import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Component } from 'react';

class CollapsibleSection extends Component {
    state = {
        isOpen: this.props.defaultOpen !== undefined ? this.props.defaultOpen : true
    }

    toggleSection = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        return (
            <div className="border rounded-lg overflow-hidden bg-white">
                <button
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={this.toggleSection}
                >
                    <span className="font-semibold text-sm">{this.props.title}</span>
                    <span className="text-gray-500">
                        {this.state.isOpen ? '▼' : '▶'}
                    </span>
                </button>
                {this.state.isOpen && (
                    <div className="p-4 space-y-4">
                        {this.props.children}
                    </div>
                )}
            </div>
        );
    }
}

class Menu extends Component {
    state = {
        sequenceInput: '[1, 2, 3, 4, 5]'
    }

    isClickable = () => {
        if (this.props.disable) {
            return { cursor: "not-allowed" };
        } else {
            return {};
        }
    }

    handleSequenceChange = (e) => {
        this.setState({ sequenceInput: e.target.value });
    }

    handleCreateFromSequence = () => {
        this.props.onCreateFromSequence(this.state.sequenceInput);
    }

    render() {
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-3">
                <h2 className="text-lg font-semibold mb-4">Linked List Controls</h2>

                <CollapsibleSection title="List Creation" defaultOpen={true}>
                    <div className="space-y-2">
                        <Button
                            className="w-full"
                            onClick={this.props.onCreateEmpty}
                            disabled={this.props.disable}
                            style={this.isClickable()}
                            variant="outline"
                        >
                            Empty List
                        </Button>

                        <div className="space-y-2">
                            <CustomSlider
                                title="Number of Nodes"
                                defaultValue={5}
                                min={1}
                                max={10}
                                step={1}
                                onChange={this.props.onCountChange}
                                disable={this.props.disable}
                            />
                            <Button
                                className="w-full"
                                onClick={this.props.onCreateRandom}
                                disabled={this.props.disable}
                                style={this.isClickable()}
                            >
                                Random List
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-600">Sequence (JSON array)</label>
                            <Input
                                value={this.state.sequenceInput}
                                onChange={this.handleSequenceChange}
                                placeholder="[1, 2, 3, 4, 5]"
                                disabled={this.props.disable}
                                className="text-sm"
                            />
                            <Button
                                className="w-full"
                                onClick={this.handleCreateFromSequence}
                                disabled={this.props.disable}
                                style={this.isClickable()}
                            >
                                List from Sequence
                            </Button>
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Operations" defaultOpen={true}>
                    <CustomSelect
                        title="Select Operation"
                        options={["Insert at Head", "Delete at Head", "Traverse List", "Reverse List"]}
                        onChange={this.props.onOperationChanged}
                    />

                    <Button
                        className="w-full"
                        onClick={this.props.onVisualize}
                        disabled={this.props.disable}
                        style={this.isClickable()}
                    >
                        Execute Operation
                    </Button>
                </CollapsibleSection>

                <CollapsibleSection title="Display Options" defaultOpen={true}>
                    <CustomSlider
                        defaultValue={50}
                        title="Speed"
                        onChange={this.props.onSpeedChange}
                        min={10}
                        max={100}
                        step={1}
                        disable={this.props.disable}
                    />

                    <Button
                        className="w-full"
                        onClick={this.props.onScramble}
                        disabled={this.props.disable}
                        style={this.isClickable()}
                    >
                        Scramble Positions
                    </Button>

                    <Button
                        className="w-full"
                        onClick={this.props.onToggleHeadHighlight}
                        disabled={this.props.disable}
                        variant={this.props.highlightHead ? "default" : "outline"}
                        style={this.isClickable()}
                    >
                        {this.props.highlightHead ? "Hide Head" : "Show Head"}
                    </Button>

                    <Button
                        className="w-full"
                        onClick={this.props.onToggleTailHighlight}
                        disabled={this.props.disable}
                        variant={this.props.highlightTail ? "default" : "outline"}
                        style={this.isClickable()}
                    >
                        {this.props.highlightTail ? "Hide Tail" : "Show Tail"}
                    </Button>
                </CollapsibleSection>
            </div>
        );
    }
}

export default Menu;