import { AppState } from '@/models/types/AppState';
import { connect } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  
});

const mapDispatchToProps = (dispatch: any) => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect;