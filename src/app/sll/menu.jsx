import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { Component } from 'react';

class Menu extends Component {
    isClickable = () => {
        if (this.props.disable) {
            return { cursor: "not-allowed" };
        } else {
            return {};
        }
    }

    render() {
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
                <h2 className="text-lg font-semibold">Linked List Controls</h2>

                <CustomSlider
                    title="Number of Nodes"
                    defaultValue={5}
                    min={1}
                    max={10}
                    step={1}
                    onChange={this.props.onCountChange}
                    disable={this.props.disable}
                />

                <CustomSlider
                    defaultValue={50}
                    title="Speed"
                    onChange={this.props.onSpeedChange}
                    min={10}
                    max={100}
                    step={1}
                    disable={this.props.disable}
                />

                <CustomSelect
                    title="Select Operation"
                    options={["Insert at Head", "Delete at Head", "Traverse List", "Reverse List"]}
                    onChange={this.props.onOperationChanged}
                />

                <Button
                    className="w-full"
                    onClick={this.props.onRandomize}
                    disabled={this.props.disable}
                    style={this.isClickable()}
                >
                    Randomize List
                </Button>

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
                    onClick={this.props.onVisualize}
                    disabled={this.props.disable}
                    style={this.isClickable()}
                >
                    Execute Operation
                </Button>
            </div>
        );
    }
}

export default Menu;