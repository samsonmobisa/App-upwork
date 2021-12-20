import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import lodashGet from 'lodash/get';
import ExpensifyText from '../../../components/ExpensifyText';
import styles from '../../../styles/styles';
import withLocalize, {withLocalizePropTypes} from '../../../components/withLocalize';
import * as Expensicons from '../../../components/Icon/Expensicons';
import * as Illustrations from '../../../components/Icon/Illustrations';
import WorkspaceSection from '../WorkspaceSection';
import Navigation from '../../../libs/Navigation/Navigation';
import ROUTES from '../../../ROUTES';
import CopyTextToClipboard from '../../../components/CopyTextToClipboard';
import * as Link from '../../../libs/actions/Link';
import ExpensiTextInput from '../../../components/ExpensiTextInput';
import ExpensiPicker from '../../../components/ExpensiPicker';
import compose from '../../../libs/compose';
import ONYXKEYS from '../../../ONYXKEYS';
import * as Policy from '../../../libs/actions/Policy';

const propTypes = {
    /** The policy ID currently being configured */
    policyID: PropTypes.string.isRequired,

    /** Policy values needed in the component */
    policy: PropTypes.shape({
        customUnit: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            value: PropTypes.string,
            rate: PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                value: PropTypes.number,
                currency: PropTypes.string,
            }),
        }),
    }).isRequired,

    ...withLocalizePropTypes,
};

class WorkspaceReimburseNoVBAView extends React.Component {
    unitItems = [
        {
            label: this.props.translate('workspace.reimburse.kilometers'),
            value: 'km',
        },
        {
            label: this.props.translate('workspace.reimburse.miles'),
            value: 'mi',
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            unitID: lodashGet(props, 'policy.customUnit.id', ''),
            unitName: lodashGet(props, 'policy.customUnit.name', ''),
            unitValue: lodashGet(props, 'policy.customUnit.value', 'mi'),
            rateID: lodashGet(props, 'policy.customUnit.rate.id', ''),
            rateName: lodashGet(props, 'policy.customUnit.rate.name', ''),
            rateValue: lodashGet(props, 'policy.customUnit.rate.value', 0).toString(),
            rateCurrency: lodashGet(props, 'policy.customUnit.rate.currency', ''),
        };
    }

    setRate(value) {
        const numValue = Number(value);
        if (Number.isNaN(numValue)) {
            return;
        }

        this.setState({rateValue: numValue.toString()});

        const values = {
            customUnitRateID: this.state.rateID,
            name: this.state.rateName,
            rate: numValue,
        };
        Policy.setCustomUnitRate(this.props.policyID, this.state.unitID, values, null);
    }

    setUnit(value) {
        this.setState({unitValue: value});

        const values = {
            customUnitID: this.state.unitID,
            customUnitName: this.state.unitName,
            attributes: {unit: value},
        };
        Policy.setCustomUnit(this.props.policyID, values, null);
    }

    render() {
        return (
            <>
                <WorkspaceSection
                    title={this.props.translate('workspace.reimburse.captureReceipts')}
                    icon={Illustrations.ReceiptYellow}
                    menuItems={[
                        {
                            title: this.props.translate('workspace.reimburse.viewAllReceipts'),
                            onPress: () => Link.openOldDotLink(`expenses?policyIDList=${this.props.policyID}&billableReimbursable=reimbursable&submitterEmail=%2B%2B`),
                            icon: Expensicons.Receipt,
                            shouldShowRightIcon: true,
                            iconRight: Expensicons.NewWindow,
                        },
                    ]}
                >
                    <View style={[styles.mv4, styles.flexRow, styles.flexWrap]}>
                        <ExpensifyText>
                            {this.props.translate('workspace.reimburse.captureNoVBACopyBeforeEmail')}
                            <CopyTextToClipboard
                                text="receipts@expensify.com"
                                textStyles={[styles.textBlue]}
                            />
                            <ExpensifyText>{this.props.translate('workspace.reimburse.captureNoVBACopyAfterEmail')}</ExpensifyText>
                        </ExpensifyText>
                    </View>
                </WorkspaceSection>

                <WorkspaceSection
                    title={this.props.translate('workspace.reimburse.trackDistance')}
                    icon={Illustrations.GpsTrackOrange}
                >
                    <View style={[styles.mv4]}>
                        <ExpensifyText>{this.props.translate('workspace.reimburse.trackDistanceCopy')}</ExpensifyText>
                    </View>
                    <View style={[styles.flexRow, styles.alignItemsCenter]}>
                        <View style={[styles.rateCol]}>
                            <ExpensiTextInput
                                label={this.props.translate('workspace.reimburse.trackDistanceRate')}
                                placeholder={this.state.rateCurrency}
                                onChangeText={value => this.setRate(value)}
                                value={this.state.rateValue}
                                autoCompleteType="off"
                                autoCorrect={false}
                            />
                        </View>
                        <View style={[styles.unitCol]}>
                            <ExpensiPicker
                                label={this.props.translate('workspace.reimburse.trackDistanceUnit')}
                                items={this.unitItems}
                                value={this.state.unitValue}
                                onChange={value => this.setUnit(value)}
                            />
                        </View>
                    </View>
                </WorkspaceSection>

                <WorkspaceSection
                    title={this.props.translate('workspace.reimburse.unlockNextDayReimbursements')}
                    icon={Illustrations.JewelBoxGreen}
                    menuItems={[
                        {
                            title: this.props.translate('workspace.common.bankAccount'),
                            onPress: () => Navigation.navigate(ROUTES.getWorkspaceBankAccountRoute(this.props.policyID)),
                            icon: Expensicons.Bank,
                            shouldShowRightIcon: true,
                        },
                    ]}
                >
                    <View style={[styles.mv4]}>
                        <ExpensifyText>{this.props.translate('workspace.reimburse.unlockNoVBACopy')}</ExpensifyText>
                    </View>
                </WorkspaceSection>
            </>
        );
    }
}

WorkspaceReimburseNoVBAView.propTypes = propTypes;
WorkspaceReimburseNoVBAView.displayName = 'WorkspaceReimburseNoVBAView';

export default compose(
    withLocalize,
    withOnyx({
        policy: {
            key: ({policyID}) => `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
        },
    }),
)(WorkspaceReimburseNoVBAView);
