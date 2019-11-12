<template>
	<Page>
		<FlexboxLayout class="page">
			<StackLayout class="form">
				<Image class="logo" src="~/images/logo.jpg" />
				<Label class="header" text="ELIXIR" />

				<StackLayout class="input-field" marginBottom="25">
					<TextField class="input" hint="Email" keyboardType="email" autocorrect="false" autocapitalizationType="none" v-model="user.email"
					 returnKeyType="next" @returnPress="focusPhone" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

                <StackLayout v-show="!isLoggingIn" class="input-field" marginBottom="25">
					<TextField ref="phoneNo" class="input" hint="Phone Number" keyboardType="phone" v-model="user.phone_no" returnKeyType="next"
					 @returnPress="focusPassword" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

				<StackLayout class="input-field" marginBottom="25">
					<TextField ref="password" class="input" hint="Password" secure="true" v-model="user.password" :returnKeyType="isLoggingIn ? 'done' : 'next'"
					 @returnPress="focusConfirmPassword" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

				<StackLayout v-show="!isLoggingIn" class="input-field">
					<TextField ref="confirmPassword" class="input" hint="Confirm password" secure="true" v-model="user.confirmPassword" returnKeyType="done"
					 fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

				<Button :text="isLoggingIn ? 'Log In' : 'Sign Up'" @tap="submit" class="btn btn-primary m-t-20" />
				<Label v-show="isLoggingIn" text="Forgot your password?" class="login-label" @tap="forgotPassword" />
			</StackLayout>

			<Label class="login-label sign-up-label" @tap="toggleForm">
	          <FormattedString>
	            <Span :text="isLoggingIn ? 'Don’t have an account? ' : 'Back to Login'" />
	            <Span :text="isLoggingIn ? 'Sign up' : ''" class="bold" />
	          </FormattedString>
	        </Label>
		</FlexboxLayout>
	</Page>
</template>

<script>
// A stub for a service that authenticates users.
import * as http from 'http';
import Home from './Home';
const appSettings = require("tns-core-modules/application-settings");
const userService = {
    register(user) {
        return Promise.resolve(user);
    },
    login(user) {
        return Promise.resolve(user);
    },
    resetPassword(email) {
        return Promise.resolve(email);
    }
};

export default {
    data() {
        return {
            isLoggingIn: true,
            user: {
                email: "",
                password: "",
                confirmPassword: "",
                phone_no: ""
            }
        };
    },
    methods: {
        toggleForm() {
            this.isLoggingIn = !this.isLoggingIn;
        },

        submit() {
            this.$navigateTo(Home);
            if (!this.user.email || !this.user.password) {
                this.alert(
                    "Please provide both an email address and password."
                );
                return;
            }
            if (this.isLoggingIn) {
                this.login();
            } else {
                this.register();
            }
        },

        login() {
            // userService
            //     .login(this.user)
            //     .then(() => {
            //         this.$navigateTo(HomePage);
            //     })
            //     .catch(() => {
            //         this.alert("Unfortunately we could not find your account.");
            //     });
            http.request({
                url: "http://ec2-3-132-175-165.us-east-2.compute.amazonaws.com/login",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    email: this.user.email,
                    password: this.user.password
                })
            }).then(response => {
                var result = response.content.toJSON();
                if(result.status){
                    appSettings.setString("token", result.token);
                    appSettings.setBoolean("loggedin", true);
                    this.$navigateTo(Home);
                }
                else{
                    this.alert("Please input a valid email id and password");
                }
                //TODO if successfully logged in, $navigateTo(Home)

            }, error => {
                console.error(error);
            });
        },

        register() {
            
            if (this.user.password != this.user.confirmPassword) {
                this.alert("Your passwords do not match.");
                return;
            }

            http.request({
                url: "http://ec2-3-132-175-165.us-east-2.compute.amazonaws.com/register",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    email: this.user.email,
                    phone_no: this.user.phone_no,
                    password: this.user.password
                })
            }).then(response => {
                var result = response.content.toJSON();
                if(result.status){
                    this.alert(result.message);
                    this.isLoggingIn = true;
                }
                else{
                    this.alert(result.message);
                }
                //TODO if successfully logged in, go to login: this.isLoggingIn = true;

            }, error => {
                console.error(error);
            });

            // userService
            //     .register(this.user)
            //     .then(() => {
            //         this.alert("Your account was successfully created.");
            //         this.isLoggingIn = true;
            //     })
            //     .catch(() => {
            //         this.alert(
            //             "Unfortunately we were unable to create your account."
            //         );
            //     });
        },

        forgotPassword() {
            prompt({
                title: "Forgot Password",
                message:
                    "Enter the email address you used to register for ELIXIR to reset your password.",
                inputType: "email",
                defaultText: "",
                okButtonText: "Ok",
                cancelButtonText: "Cancel"
            }).then(data => {
                if (data.result) {
                    userService
                        .resetPassword(data.text.trim())
                        .then(() => {
                            this.alert(
                                "Your password was successfully reset. Please check your email for instructions on choosing a new password."
                            );
                        })
                        .catch(() => {
                            this.alert(
                                "Unfortunately, an error occurred resetting your password."
                            );
                        });
                }
            });
        },

        focusPassword() {
            this.$refs.password.nativeView.focus();
        },
        focusConfirmPassword() {
            if (!this.isLoggingIn) {
                this.$refs.confirmPassword.nativeView.focus();
            }
        },
        focusPhone(){
            if (!this.isLoggingIn) {
                this.$refs.phoneNo.nativeView.focus();
            }
            else{
                this.$refs.password.nativeView.focus();
            }
        },

        alert(message) {
            return alert({
                title: "ELIXIR",
                okButtonText: "OK",
                message: message
            });
        }
    }
};
</script>

<style scoped>
	.page {
		align-items: center;
		flex-direction: column;
	}

	.form {
		margin-left: 30;
		margin-right: 30;
		flex-grow: 2;
		vertical-align: middle;
	}

	.logo {
		margin-bottom: 12;
		height: 90;
		font-weight: bold;
	}

	.header {
		horizontal-align: center;
		font-size: 25;
		font-weight: 600;
		margin-bottom: 70;
		text-align: center;
		color: #D51A1A;
	}

	.input-field {
		margin-bottom: 25;
	}

	.input {
		font-size: 18;
		placeholder-color: #A8A8A8;
        color: black;
	}

	.input-field .input {
		font-size: 54;
	}

	.btn-primary {
		height: 50;
		margin: 30 5 15 5;
		background-color: #D51A1A;
		border-radius: 5;
		font-size: 20;
		font-weight: 600;
	}

	.login-label {
		horizontal-align: center;
		color: #A8A8A8;
		font-size: 16;
	}

	.sign-up-label {
		margin-bottom: 20;
	}

	.bold {
		color: #000000;
	}
</style>
