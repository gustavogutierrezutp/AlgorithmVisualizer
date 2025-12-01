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
        sequenceInput: '[1, 2, 3, 4, 5]',
        creationMode: 'random', // 'empty', 'random', 'custom'
        insertValue: Math.floor(Math.random() * 100)
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

    refreshInsertValue = () => {
        this.setState({ insertValue: Math.floor(Math.random() * 100) });
    }

    render() {
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-3">

                <CollapsibleSection title="List Creation" defaultOpen={true}>
                    <div className="space-y-4">
                        {/* Tabs */}
                        <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg">
                            {['Empty', 'Random', 'Custom'].map((mode) => (
                                <button
                                    key={mode}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${this.state.creationMode === mode.toLowerCase()
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    onClick={() => this.setState({ creationMode: mode.toLowerCase() })}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        {/* Content based on active tab */}
                        {this.state.creationMode === 'empty' && (
                            <Button
                                className="w-full"
                                onClick={this.props.onCreateEmpty}
                                disabled={this.props.disable}
                                style={this.isClickable()}
                                variant="outline"
                            >
                                Create Empty List
                            </Button>
                        )}

                        {this.state.creationMode === 'random' && (
                            <div className="space-y-4">
                                <CustomSlider
                                    title="Number of Nodes"
                                    defaultValue={5}
                                    min={1}
                                    max={100}
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
                                    Create Random List
                                </Button>
                            </div>
                        )}

                        {this.state.creationMode === 'custom' && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-600">Sequence (JSON array)</label>
                                <Input
                                    value={this.state.sequenceInput}
                                    onChange={this.handleSequenceChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            this.handleCreateFromSequence();
                                        }
                                    }}
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
                                    Create from Sequence
                                </Button>
                            </div>
                        )}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Operations" defaultOpen={true}>
                    <div className="space-y-2">
                        {/* Insertion Operations */}
                        <CollapsibleSection title="Insertion" defaultOpen={true}>
                            <Input
                                value={this.state.insertValue}
                                onChange={(e) => this.setState({ insertValue: e.target.value })}
                                onFocus={(e) => e.target.select()}
                                placeholder="Value (e.g. 42)"
                                disabled={this.props.disable}
                                className="text-sm mb-2"
                                type="number"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={() => this.props.onVisualize(0, this.state.insertValue)}
                                    disabled={this.props.disable}
                                    style={this.isClickable()}
                                    variant="outline"
                                    size="sm"
                                >
                                    push_front
                                </Button>
                                <Button
                                    onClick={() => this.props.onVisualize(2, this.state.insertValue)}
                                    disabled={this.props.disable}
                                    style={this.isClickable()}
                                    variant="outline"
                                    size="sm"
                                >
                                    push_back
                                </Button>
                            </div>
                        </CollapsibleSection>

                        {/* Removal Operations */}
                        <CollapsibleSection title="Removal" defaultOpen={true}>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={() => this.props.onVisualize(1)}
                                    disabled={this.props.disable}
                                    style={this.isClickable()}
                                    variant="outline"
                                    size="sm"
                                >
                                    pop_front
                                </Button>
                                <Button
                                    onClick={() => this.props.onVisualize(3)}
                                    disabled={this.props.disable}
                                    style={this.isClickable()}
                                    variant="outline"
                                    size="sm"
                                >
                                    pop_back
                                </Button>
                            </div>
                        </CollapsibleSection>

                        {/* Access Operations */}
                        <CollapsibleSection title="Access" defaultOpen={true}>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={this.props.onToggleHeadHighlight}
                                    disabled={this.props.disable}
                                    style={this.isClickable()}
                                    variant={this.props.highlightHead ? "default" : "outline"}
                                    size="sm"
                                >
                                    front
                                </Button>
                                <Button
                                    onClick={this.props.onToggleTailHighlight}
                                    disabled={this.props.disable}
                                    style={this.isClickable()}
                                    variant={this.props.highlightTail ? "default" : "outline"}
                                    size="sm"
                                >
                                    back
                                </Button>
                            </div>
                        </CollapsibleSection>

                        {/* Utility Operations */}
                        <CollapsibleSection title="Utility" defaultOpen={true}>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={() => this.props.onVisualize(4)}
                                    disabled={this.props.disable}
                                    style={this.isClickable()}
                                    variant="outline"
                                    size="sm"
                                >
                                    Traverse
                                </Button>
                                <Button
                                    onClick={() => this.props.onVisualize(5)}
                                    disabled={this.props.disable}
                                    style={this.isClickable()}
                                    variant="outline"
                                    size="sm"
                                >
                                    Reverse
                                </Button>
                            </div>
                        </CollapsibleSection>
                    </div>
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

                </CollapsibleSection>
            </div>
        );
    }
}

export default Menu;