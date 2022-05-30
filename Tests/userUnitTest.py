from Services.userService import userService
import unittest

user_service = userService()


class userTest(unittest.TestCase):

    def test_user(self):
        new_user_key = ''
        try:
            new_user_key = user_service.create_user('0544535935')[0]
            s_failed = user_service.add_user_name_and_password(new_user_key, 'user_name_test', 'a3030800!')
            self.assertEqual(s_failed[1], 'the password must include Uppercase Characters')
            s_success = user_service.add_user_name_and_password(new_user_key, 'user_name_test', 'Aa3030800!')
            self.assertEqual(s_success[1], 'create user name and password success')
            update_password_pass_incorrect = user_service.change_password('user_name_test', 'Aa3030800$', 'Aa3030800')
            self.assertEqual(update_password_pass_incorrect[1], 'the user name or password incorrect', 'update_password_pass_incorrect')

            update_password_success = user_service.change_password('user_name_test', 'Aa3030800!', 'Aa3030800@')
            self.assertTrue(update_password_success[0], 'update_password_success')

            login_failed_username = user_service.login_user_name_and_password('user_name_te', 'Aa3030800@')
            login_failed_password = user_service.login_user_name_and_password('user_name_test', 'A3030800$')

            self.assertEqual(login_failed_username[1], 'the user name or password incorrect', 'login_failed_username')
            self.assertEqual(login_failed_password[1], 'the user name or password incorrect', 'login_failed_password')

            login_success = user_service.login_user_name_and_password('user_name_test', 'Aa3030800@')
            self.assertEqual(login_success[1], new_user_key, 'login_success')

        finally:
            user_service.delete_user(new_user_key)



if __name__ == '__main__':
   unittest.main()