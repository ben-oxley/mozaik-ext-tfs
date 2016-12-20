import React, { Component, PropTypes } from 'react';
import reactMixin                      from 'react-mixin';
import { ListenerMixin }               from 'reflux';
import _                               from 'lodash';
import Mozaik                          from 'mozaik/browser';
const  { Treemap }                     = Mozaik.Component;


class IssueLabelsTreemap extends Component {
    constructor(props) {
        super(props);

        this.state = { labels: [] };
    }

    getApiRequest() {
        const { labels, repository } = this.props;

        const labelNames = labels.map(label => label.name);

        return {
            id:     `github.issueLabelsAggregations.${ labelNames.join('.') }`,
            params: { repository, labels }
        };
    }

    onApiData(labels) {
        this.setState({ labels });
    }

    render() {
        const { labels } = this.state;

        const data = labels.map(label => ({
            label: label.name,
            count: label.count,
            color: label.color
        }));

        return (
            <div>
                <div className="widget__header">
                    Github issues types
                    <i className="fa fa-github" />
                </div>
                <div className="widget__body">
                    <Treemap data={{ children: data }} showCount={true} />
                </div>
            </div>
        );
    }
}

IssueLabelsTreemap.displayName = 'IssueLabelsTreemap';

IssueLabelsTreemap.propTypes = {
    repository: PropTypes.string.isRequired,
    labels:     PropTypes.arrayOf(PropTypes.shape({
        name:  PropTypes.string,
        color: PropTypes.string
    })).isRequired
};

reactMixin(IssueLabelsTreemap.prototype, ListenerMixin);
reactMixin(IssueLabelsTreemap.prototype, Mozaik.Mixin.ApiConsumer);


export default IssueLabelsTreemap;
