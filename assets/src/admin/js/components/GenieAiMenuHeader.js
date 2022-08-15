
import { Affix, Row, Col, Badge } from 'antd';
import LicenseNotice from './LicenseNotice';

const rowLayout = { gutter: 32 };

function GenieAiMenuHeader() {
	return (
		<>
			<header>
				<Affix offsetTop={32} className="getgenie-plugin-header">
					<div className="getgenie-dashboard-header">
						<Row className="getgenie-header-row" {...rowLayout}>
							<Col span={10}>
								<Badge count={'V' + window.getGenie.config.version || '1.0'}>
									<img src={`${window.getGenie.config.assetsUrl}/dist/admin/images/Genie_logo_black.svg`} alt="Genie AI" />
								</Badge>
							</Col>
						</Row>
					</div>
				</Affix>
			</header>
			<LicenseNotice />
		</>
	);
}
export default GenieAiMenuHeader