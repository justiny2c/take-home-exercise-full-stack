import React from 'react';
import axios from 'axios';
import TeamMember from '../TeamMember';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: [],
      loading: true,
      form: { firstName: '', lastName: '', title: '', story: '' },
      isVisible: false,
    };
  }

  async componentDidMount() {
    try {
      await this.fetchInitialData();
    } catch (error) {
      // try again after half a second if fails due to race condition
      console.log('retrying initial data request...');
      setTimeout(async () => {
        await this.fetchInitialData();
      }, 500);
    }
  }

  async fetchInitialData() {
    const response = await axios.get('/team');
    this.setState({
      team: response.data,
      loading: false,
    });
  }

  toggle = e => {
    if (document.getElementById('form-id').className === 'form')
      document.getElementById('form-id').className = 'form-show';
    else document.getElementById('form-id').className = 'form';
  };

  handleChange = e => {
    this.setState({
      form: { [e.target.name]: e.target.value },
    });
    console.log('State', this.state.form);
  };

  submit = e => {
    e.preventDefault();
    let creds = this.state.form;
    axios
      .post(`http://localhost:3001/team`, creds)
      .then(res => {
        console.log('POST', res.data);
        return res.data;
      })
      .catch(err => {
        console.log('Failed');
        return err.response;
      });

    this.setState({
      form: {
        firstName: '',
        lastName: '',
        title: '',
        story: '',
      },
    });
  };

  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    }

    return (
      <div className='app'>
        <div className='team-grid' />
        {this.state.team.map(member => (
          <TeamMember
            key={member.id}
            name={`${member.firstName} ${member.lastName}`}
            title={member.title}
            photoUrl={member.photoUrl}
            story={member.story}
            favoriteColor={member.favoriteColor}
          />
        ))}
        {/* Make this new team member link to your form! */}
        <TeamMember
          id='new'
          name={
            <button className='join-button' onClick={this.toggle}>
              Join us!
            </button>
          }
          title='New Teammate'
          story={
            <div id='form-id' className='form'>
              <p>Fill out form below: </p>
              <form className='input-form'>
                <input
                  type='text'
                  name='firstName'
                  placeholder='First name'
                  value={this.state.form.firstName}
                  onChange={this.handleChange}
                />
                <br />
                <input
                  type='text'
                  name='lastName'
                  placeholder='Last name'
                  value={this.state.form.lastName}
                  onChange={this.handleChange}
                />
                <br />
                <input
                  type='text'
                  name='title'
                  placeholder='Title'
                  value={this.state.form.title}
                  onChange={this.handleChange}
                />{' '}
                <br />
                <textarea
                  type='text'
                  name='story'
                  placeholder='Story'
                  className='story-input'
                  value={this.state.form.story}
                  onChange={this.handleChange}
                />{' '}
                <br />
                <button className='submit' onClick={this.submit}>
                  Submit
                </button>
              </form>
            </div>
          }
        />
      </div>
    );
  }
}

export default App;
