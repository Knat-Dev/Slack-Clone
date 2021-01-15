import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  users: Array<User>;
  user?: Maybe<User>;
  allUsers?: Maybe<Array<User>>;
  me: User;
  team?: Maybe<Team>;
  getTeamMembers: Array<User>;
  userStatuses: Array<User>;
  messages: PaginatedMessages;
  newMessages: Array<Message>;
  directMessages: Array<DirectMessage>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryTeamArgs = {
  id: Scalars['String'];
};


export type QueryGetTeamMembersArgs = {
  teamId: Scalars['String'];
};


export type QueryUserStatusesArgs = {
  teamId: Scalars['String'];
};


export type QueryMessagesArgs = {
  cursor?: Maybe<Scalars['String']>;
  channelId: Scalars['String'];
};


export type QueryNewMessagesArgs = {
  cursor?: Maybe<Scalars['String']>;
  channelId: Scalars['String'];
};


export type QueryDirectMessagesArgs = {
  teamId: Scalars['String'];
  receiverId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  _username: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  online?: Maybe<Scalars['Boolean']>;
  tokenVersion: Scalars['Float'];
  teams?: Maybe<Array<Team>>;
  channels?: Maybe<Array<Channel>>;
  createdAt: Scalars['Float'];
  updatedAt: Scalars['Float'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID'];
  name: Scalars['String'];
  owner: User;
  admin?: Maybe<Scalars['Boolean']>;
  members?: Maybe<Array<User>>;
  directMessages?: Maybe<Array<User>>;
  createdAt: Scalars['Float'];
  updatedAt: Scalars['Float'];
  channels: Array<Channel>;
};

export type Channel = {
  __typename?: 'Channel';
  id: Scalars['ID'];
  name: Scalars['String'];
  team: Team;
  public: Scalars['Boolean'];
  dm?: Maybe<Scalars['Boolean']>;
  messages?: Maybe<Array<Message>>;
  users?: Maybe<Array<User>>;
  createdAt: Scalars['Float'];
  updatedAt: Scalars['Float'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  filetype?: Maybe<Scalars['String']>;
  user: User;
  channelId: Scalars['String'];
  channel: Channel;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PaginatedMessages = {
  __typename?: 'PaginatedMessages';
  hasMore: Scalars['Boolean'];
  page: Array<Message>;
};

export type DirectMessage = {
  __typename?: 'DirectMessage';
  id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  filetype?: Maybe<Scalars['String']>;
  sender: User;
  receiver: User;
  team: Team;
  createdAt: Scalars['Float'];
  updatedAt: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register: RegisterResponse;
  login: LoginResponse;
  revokeRefreshTokenForUser: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  createChannel: ChannelResponse;
  createTeam?: Maybe<CreateTeamResponse>;
  addTeamMember: InvitePeopleResponse;
  createMessage?: Maybe<Message>;
  uploadFile: Scalars['Boolean'];
  deleteMessage: Scalars['Boolean'];
  createDirectMessage: Scalars['Boolean'];
  uploadFileDirect: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRevokeRefreshTokenForUserArgs = {
  userId: Scalars['String'];
};


export type MutationCreateChannelArgs = {
  dm?: Maybe<Scalars['Boolean']>;
  public?: Maybe<Scalars['Boolean']>;
  users: Array<MemberMultiselect>;
  name: Scalars['String'];
  teamId: Scalars['String'];
};


export type MutationCreateTeamArgs = {
  name: Scalars['String'];
};


export type MutationAddTeamMemberArgs = {
  teamId: Scalars['String'];
  email: Scalars['String'];
};


export type MutationCreateMessageArgs = {
  teamId: Scalars['String'];
  text: Scalars['String'];
  channelId: Scalars['String'];
};


export type MutationUploadFileArgs = {
  teamId: Scalars['String'];
  file: Scalars['Upload'];
  channelId: Scalars['String'];
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['String'];
};


export type MutationCreateDirectMessageArgs = {
  text: Scalars['String'];
  teamId: Scalars['String'];
  receiverId: Scalars['String'];
};


export type MutationUploadFileDirectArgs = {
  teamId: Scalars['String'];
  file: Scalars['Upload'];
  receiverId: Scalars['String'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  ok?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Array<FieldError>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  user?: Maybe<User>;
  errors?: Maybe<Array<FieldError>>;
};

export type ChannelResponse = {
  __typename?: 'ChannelResponse';
  channel?: Maybe<Channel>;
  ok: Scalars['Boolean'];
  errors?: Maybe<Array<FieldError>>;
};

export type MemberMultiselect = {
  value: Scalars['String'];
  label: Scalars['String'];
};

export type CreateTeamResponse = {
  __typename?: 'CreateTeamResponse';
  team?: Maybe<Team>;
  ok: Scalars['Boolean'];
  errors?: Maybe<Array<FieldError>>;
};

export type InvitePeopleResponse = {
  __typename?: 'InvitePeopleResponse';
  ok: Scalars['Boolean'];
  errors?: Maybe<Array<FieldError>>;
  member?: Maybe<User>;
};


export type Subscription = {
  __typename?: 'Subscription';
  newUserStatus?: Maybe<User>;
  newChannelMessage?: Maybe<Message>;
  newDirectMessage?: Maybe<DirectMessage>;
};


export type SubscriptionNewUserStatusArgs = {
  teamId: Scalars['String'];
};


export type SubscriptionNewChannelMessageArgs = {
  channelId: Scalars['String'];
};


export type SubscriptionNewDirectMessageArgs = {
  teamId: Scalars['String'];
  receiverId: Scalars['String'];
};

export type RegularChannelFragment = (
  { __typename?: 'Channel' }
  & Pick<Channel, 'id' | 'name' | 'public' | 'dm'>
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularMemberFragment = (
  { __typename?: 'User' }
  & RegularUserFragment
);

export type RegularMessageFragment = (
  { __typename?: 'Message' }
  & Pick<Message, 'id' | 'text' | 'url' | 'filetype' | 'channelId' | 'createdAt' | 'updatedAt'>
  & { user: (
    { __typename?: 'User' }
    & RegularUserFragment
  ) }
);

export type RegularTeamFragment = (
  { __typename?: 'Team' }
  & Pick<Team, 'id' | 'name' | 'admin'>
  & { owner: (
    { __typename?: 'User' }
    & RegularUserFragment
  ), channels: Array<(
    { __typename?: 'Channel' }
    & RegularChannelFragment
  )> }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type RegularUserStatusFragment = (
  { __typename?: 'User' }
  & Pick<User, 'username' | 'online'>
);

export type CreateChannelMutationVariables = Exact<{
  name: Scalars['String'];
  teamId: Scalars['String'];
  public?: Maybe<Scalars['Boolean']>;
  users: Array<MemberMultiselect>;
  dm?: Maybe<Scalars['Boolean']>;
}>;


export type CreateChannelMutation = (
  { __typename?: 'Mutation' }
  & { createChannel: (
    { __typename?: 'ChannelResponse' }
    & Pick<ChannelResponse, 'ok'>
    & { channel?: Maybe<(
      { __typename?: 'Channel' }
      & RegularChannelFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type CreateMessageMutationVariables = Exact<{
  channelId: Scalars['String'];
  text: Scalars['String'];
  teamId: Scalars['String'];
}>;


export type CreateMessageMutation = (
  { __typename?: 'Mutation' }
  & { createMessage?: Maybe<(
    { __typename?: 'Message' }
    & RegularMessageFragment
  )> }
);

export type CreateTeamMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateTeamMutation = (
  { __typename?: 'Mutation' }
  & { createTeam?: Maybe<(
    { __typename?: 'CreateTeamResponse' }
    & Pick<CreateTeamResponse, 'ok'>
    & { team?: Maybe<(
      { __typename?: 'Team' }
      & RegularTeamFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
      & RegularErrorFragment
    )>> }
  )> }
);

export type DeleteMessageMutationVariables = Exact<{
  messageId: Scalars['String'];
}>;


export type DeleteMessageMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteMessage'>
);

export type InvitePeopleMutationVariables = Exact<{
  email: Scalars['String'];
  teamId: Scalars['String'];
}>;


export type InvitePeopleMutation = (
  { __typename?: 'Mutation' }
  & { addTeamMember: (
    { __typename?: 'InvitePeopleResponse' }
    & Pick<InvitePeopleResponse, 'ok'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, member?: Maybe<(
      { __typename?: 'User' }
      & RegularMemberFragment
    )> }
  ) }
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'RegisterResponse' }
    & Pick<RegisterResponse, 'ok'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>> }
  ) }
);

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload'];
  teamId: Scalars['String'];
  channelId: Scalars['String'];
}>;


export type UploadFileMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'uploadFile'>
);

export type UploadFileDirectMutationVariables = Exact<{
  file: Scalars['Upload'];
  teamId: Scalars['String'];
  receiverId: Scalars['String'];
}>;


export type UploadFileDirectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'uploadFileDirect'>
);

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = (
  { __typename?: 'Query' }
  & { allUsers?: Maybe<Array<(
    { __typename?: 'User' }
    & RegularUserFragment
  )>> }
);

export type GetTeamMembersQueryVariables = Exact<{
  teamId: Scalars['String'];
}>;


export type GetTeamMembersQuery = (
  { __typename?: 'Query' }
  & { getTeamMembers: Array<(
    { __typename?: 'User' }
    & RegularMemberFragment
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
    & { teams?: Maybe<Array<(
      { __typename?: 'Team' }
      & RegularTeamFragment
    )>> }
  ) }
);

export type MessagesQueryVariables = Exact<{
  channelId: Scalars['String'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type MessagesQuery = (
  { __typename?: 'Query' }
  & { messages: (
    { __typename?: 'PaginatedMessages' }
    & Pick<PaginatedMessages, 'hasMore'>
    & { page: Array<(
      { __typename?: 'Message' }
      & RegularMessageFragment
    )> }
  ) }
);

export type NewMessagesQueryVariables = Exact<{
  channelId: Scalars['String'];
  cursor: Scalars['String'];
}>;


export type NewMessagesQuery = (
  { __typename?: 'Query' }
  & { newMessages: Array<(
    { __typename?: 'Message' }
    & RegularMessageFragment
  )> }
);

export type UserStatusesQueryVariables = Exact<{
  teamId: Scalars['String'];
}>;


export type UserStatusesQuery = (
  { __typename?: 'Query' }
  & { userStatuses: Array<(
    { __typename?: 'User' }
    & Pick<User, 'online' | 'username'>
  )> }
);

export type NewChannelMessageSubscriptionVariables = Exact<{
  channelId: Scalars['String'];
}>;


export type NewChannelMessageSubscription = (
  { __typename?: 'Subscription' }
  & { newChannelMessage?: Maybe<(
    { __typename?: 'Message' }
    & RegularMessageFragment
  )> }
);

export type NewDirectMessageSubscriptionVariables = Exact<{
  receiverId: Scalars['String'];
  teamId: Scalars['String'];
}>;


export type NewDirectMessageSubscription = (
  { __typename?: 'Subscription' }
  & { newDirectMessage?: Maybe<(
    { __typename?: 'DirectMessage' }
    & Pick<DirectMessage, 'id' | 'text' | 'createdAt' | 'updatedAt'>
    & { sender: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type NewUserStatusSubscriptionVariables = Exact<{
  teamId: Scalars['String'];
}>;


export type NewUserStatusSubscription = (
  { __typename?: 'Subscription' }
  & { newUserStatus?: Maybe<(
    { __typename?: 'User' }
    & RegularUserStatusFragment
  )> }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularMemberFragmentDoc = gql`
    fragment RegularMember on User {
  ...RegularUser
}
    ${RegularUserFragmentDoc}`;
export const RegularMessageFragmentDoc = gql`
    fragment RegularMessage on Message {
  id
  text
  url
  filetype
  channelId
  user {
    ...RegularUser
  }
  createdAt
  updatedAt
}
    ${RegularUserFragmentDoc}`;
export const RegularChannelFragmentDoc = gql`
    fragment RegularChannel on Channel {
  id
  name
  public
  dm
}
    `;
export const RegularTeamFragmentDoc = gql`
    fragment RegularTeam on Team {
  id
  name
  admin
  owner {
    ...RegularUser
  }
  channels {
    ...RegularChannel
  }
}
    ${RegularUserFragmentDoc}
${RegularChannelFragmentDoc}`;
export const RegularUserStatusFragmentDoc = gql`
    fragment RegularUserStatus on User {
  username
  online
}
    `;
export const CreateChannelDocument = gql`
    mutation CreateChannel($name: String!, $teamId: String!, $public: Boolean, $users: [MemberMultiselect!]!, $dm: Boolean) {
  createChannel(
    name: $name
    teamId: $teamId
    public: $public
    users: $users
    dm: $dm
  ) {
    channel {
      ...RegularChannel
    }
    ok
    errors {
      field
      message
    }
  }
}
    ${RegularChannelFragmentDoc}`;
export type CreateChannelMutationFn = Apollo.MutationFunction<CreateChannelMutation, CreateChannelMutationVariables>;

/**
 * __useCreateChannelMutation__
 *
 * To run a mutation, you first call `useCreateChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChannelMutation, { data, loading, error }] = useCreateChannelMutation({
 *   variables: {
 *      name: // value for 'name'
 *      teamId: // value for 'teamId'
 *      public: // value for 'public'
 *      users: // value for 'users'
 *      dm: // value for 'dm'
 *   },
 * });
 */
export function useCreateChannelMutation(baseOptions?: Apollo.MutationHookOptions<CreateChannelMutation, CreateChannelMutationVariables>) {
        return Apollo.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, baseOptions);
      }
export type CreateChannelMutationHookResult = ReturnType<typeof useCreateChannelMutation>;
export type CreateChannelMutationResult = Apollo.MutationResult<CreateChannelMutation>;
export type CreateChannelMutationOptions = Apollo.BaseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($channelId: String!, $text: String!, $teamId: String!) {
  createMessage(channelId: $channelId, text: $text, teamId: $teamId) {
    ...RegularMessage
  }
}
    ${RegularMessageFragmentDoc}`;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      text: // value for 'text'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, baseOptions);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const CreateTeamDocument = gql`
    mutation CreateTeam($name: String!) {
  createTeam(name: $name) {
    team {
      ...RegularTeam
    }
    ok
    errors {
      field
      message
      ...RegularError
    }
    ok
    errors {
      ...RegularError
    }
  }
}
    ${RegularTeamFragmentDoc}
${RegularErrorFragmentDoc}`;
export type CreateTeamMutationFn = Apollo.MutationFunction<CreateTeamMutation, CreateTeamMutationVariables>;

/**
 * __useCreateTeamMutation__
 *
 * To run a mutation, you first call `useCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMutation, { data, loading, error }] = useCreateTeamMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>) {
        return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(CreateTeamDocument, baseOptions);
      }
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>;
export type CreateTeamMutationResult = Apollo.MutationResult<CreateTeamMutation>;
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<CreateTeamMutation, CreateTeamMutationVariables>;
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($messageId: String!) {
  deleteMessage(messageId: $messageId)
}
    `;
export type DeleteMessageMutationFn = Apollo.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useDeleteMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>) {
        return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, baseOptions);
      }
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const InvitePeopleDocument = gql`
    mutation InvitePeople($email: String!, $teamId: String!) {
  addTeamMember(email: $email, teamId: $teamId) {
    ok
    errors {
      ...RegularError
    }
    member {
      ...RegularMember
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularMemberFragmentDoc}`;
export type InvitePeopleMutationFn = Apollo.MutationFunction<InvitePeopleMutation, InvitePeopleMutationVariables>;

/**
 * __useInvitePeopleMutation__
 *
 * To run a mutation, you first call `useInvitePeopleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvitePeopleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invitePeopleMutation, { data, loading, error }] = useInvitePeopleMutation({
 *   variables: {
 *      email: // value for 'email'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useInvitePeopleMutation(baseOptions?: Apollo.MutationHookOptions<InvitePeopleMutation, InvitePeopleMutationVariables>) {
        return Apollo.useMutation<InvitePeopleMutation, InvitePeopleMutationVariables>(InvitePeopleDocument, baseOptions);
      }
export type InvitePeopleMutationHookResult = ReturnType<typeof useInvitePeopleMutation>;
export type InvitePeopleMutationResult = Apollo.MutationResult<InvitePeopleMutation>;
export type InvitePeopleMutationOptions = Apollo.BaseMutationOptions<InvitePeopleMutation, InvitePeopleMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    accessToken
    user {
      ...RegularUser
    }
    errors {
      ...RegularError
    }
  }
}
    ${RegularUserFragmentDoc}
${RegularErrorFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    ok
    errors {
      ...RegularError
    }
  }
}
    ${RegularErrorFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const UploadFileDocument = gql`
    mutation UploadFile($file: Upload!, $teamId: String!, $channelId: String!) {
  uploadFile(file: $file, teamId: $teamId, channelId: $channelId)
}
    `;
export type UploadFileMutationFn = Apollo.MutationFunction<UploadFileMutation, UploadFileMutationVariables>;

/**
 * __useUploadFileMutation__
 *
 * To run a mutation, you first call `useUploadFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileMutation, { data, loading, error }] = useUploadFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *      teamId: // value for 'teamId'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileMutation, UploadFileMutationVariables>) {
        return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(UploadFileDocument, baseOptions);
      }
export type UploadFileMutationHookResult = ReturnType<typeof useUploadFileMutation>;
export type UploadFileMutationResult = Apollo.MutationResult<UploadFileMutation>;
export type UploadFileMutationOptions = Apollo.BaseMutationOptions<UploadFileMutation, UploadFileMutationVariables>;
export const UploadFileDirectDocument = gql`
    mutation UploadFileDirect($file: Upload!, $teamId: String!, $receiverId: String!) {
  uploadFileDirect(file: $file, teamId: $teamId, receiverId: $receiverId)
}
    `;
export type UploadFileDirectMutationFn = Apollo.MutationFunction<UploadFileDirectMutation, UploadFileDirectMutationVariables>;

/**
 * __useUploadFileDirectMutation__
 *
 * To run a mutation, you first call `useUploadFileDirectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileDirectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileDirectMutation, { data, loading, error }] = useUploadFileDirectMutation({
 *   variables: {
 *      file: // value for 'file'
 *      teamId: // value for 'teamId'
 *      receiverId: // value for 'receiverId'
 *   },
 * });
 */
export function useUploadFileDirectMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileDirectMutation, UploadFileDirectMutationVariables>) {
        return Apollo.useMutation<UploadFileDirectMutation, UploadFileDirectMutationVariables>(UploadFileDirectDocument, baseOptions);
      }
export type UploadFileDirectMutationHookResult = ReturnType<typeof useUploadFileDirectMutation>;
export type UploadFileDirectMutationResult = Apollo.MutationResult<UploadFileDirectMutation>;
export type UploadFileDirectMutationOptions = Apollo.BaseMutationOptions<UploadFileDirectMutation, UploadFileDirectMutationVariables>;
export const AllUsersDocument = gql`
    query AllUsers {
  allUsers {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useAllUsersQuery__
 *
 * To run a query within a React component, call `useAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
        return Apollo.useQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, baseOptions);
      }
export function useAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
          return Apollo.useLazyQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, baseOptions);
        }
export type AllUsersQueryHookResult = ReturnType<typeof useAllUsersQuery>;
export type AllUsersLazyQueryHookResult = ReturnType<typeof useAllUsersLazyQuery>;
export type AllUsersQueryResult = Apollo.QueryResult<AllUsersQuery, AllUsersQueryVariables>;
export const GetTeamMembersDocument = gql`
    query GetTeamMembers($teamId: String!) {
  getTeamMembers(teamId: $teamId) {
    ...RegularMember
  }
}
    ${RegularMemberFragmentDoc}`;

/**
 * __useGetTeamMembersQuery__
 *
 * To run a query within a React component, call `useGetTeamMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamMembersQuery({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useGetTeamMembersQuery(baseOptions: Apollo.QueryHookOptions<GetTeamMembersQuery, GetTeamMembersQueryVariables>) {
        return Apollo.useQuery<GetTeamMembersQuery, GetTeamMembersQueryVariables>(GetTeamMembersDocument, baseOptions);
      }
export function useGetTeamMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamMembersQuery, GetTeamMembersQueryVariables>) {
          return Apollo.useLazyQuery<GetTeamMembersQuery, GetTeamMembersQueryVariables>(GetTeamMembersDocument, baseOptions);
        }
export type GetTeamMembersQueryHookResult = ReturnType<typeof useGetTeamMembersQuery>;
export type GetTeamMembersLazyQueryHookResult = ReturnType<typeof useGetTeamMembersLazyQuery>;
export type GetTeamMembersQueryResult = Apollo.QueryResult<GetTeamMembersQuery, GetTeamMembersQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    teams {
      ...RegularTeam
    }
  }
}
    ${RegularTeamFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MessagesDocument = gql`
    query Messages($channelId: String!, $cursor: String) {
  messages(channelId: $channelId, cursor: $cursor) {
    page {
      ...RegularMessage
    }
    hasMore
  }
}
    ${RegularMessageFragmentDoc}`;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useMessagesQuery(baseOptions: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, baseOptions);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, baseOptions);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const NewMessagesDocument = gql`
    query NewMessages($channelId: String!, $cursor: String!) {
  newMessages(channelId: $channelId, cursor: $cursor) {
    ...RegularMessage
  }
}
    ${RegularMessageFragmentDoc}`;

/**
 * __useNewMessagesQuery__
 *
 * To run a query within a React component, call `useNewMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessagesQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useNewMessagesQuery(baseOptions: Apollo.QueryHookOptions<NewMessagesQuery, NewMessagesQueryVariables>) {
        return Apollo.useQuery<NewMessagesQuery, NewMessagesQueryVariables>(NewMessagesDocument, baseOptions);
      }
export function useNewMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewMessagesQuery, NewMessagesQueryVariables>) {
          return Apollo.useLazyQuery<NewMessagesQuery, NewMessagesQueryVariables>(NewMessagesDocument, baseOptions);
        }
export type NewMessagesQueryHookResult = ReturnType<typeof useNewMessagesQuery>;
export type NewMessagesLazyQueryHookResult = ReturnType<typeof useNewMessagesLazyQuery>;
export type NewMessagesQueryResult = Apollo.QueryResult<NewMessagesQuery, NewMessagesQueryVariables>;
export const UserStatusesDocument = gql`
    query UserStatuses($teamId: String!) {
  userStatuses(teamId: $teamId) {
    online
    username
  }
}
    `;

/**
 * __useUserStatusesQuery__
 *
 * To run a query within a React component, call `useUserStatusesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserStatusesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserStatusesQuery({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useUserStatusesQuery(baseOptions: Apollo.QueryHookOptions<UserStatusesQuery, UserStatusesQueryVariables>) {
        return Apollo.useQuery<UserStatusesQuery, UserStatusesQueryVariables>(UserStatusesDocument, baseOptions);
      }
export function useUserStatusesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserStatusesQuery, UserStatusesQueryVariables>) {
          return Apollo.useLazyQuery<UserStatusesQuery, UserStatusesQueryVariables>(UserStatusesDocument, baseOptions);
        }
export type UserStatusesQueryHookResult = ReturnType<typeof useUserStatusesQuery>;
export type UserStatusesLazyQueryHookResult = ReturnType<typeof useUserStatusesLazyQuery>;
export type UserStatusesQueryResult = Apollo.QueryResult<UserStatusesQuery, UserStatusesQueryVariables>;
export const NewChannelMessageDocument = gql`
    subscription NewChannelMessage($channelId: String!) {
  newChannelMessage(channelId: $channelId) {
    ...RegularMessage
  }
}
    ${RegularMessageFragmentDoc}`;

/**
 * __useNewChannelMessageSubscription__
 *
 * To run a query within a React component, call `useNewChannelMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewChannelMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewChannelMessageSubscription({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useNewChannelMessageSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewChannelMessageSubscription, NewChannelMessageSubscriptionVariables>) {
        return Apollo.useSubscription<NewChannelMessageSubscription, NewChannelMessageSubscriptionVariables>(NewChannelMessageDocument, baseOptions);
      }
export type NewChannelMessageSubscriptionHookResult = ReturnType<typeof useNewChannelMessageSubscription>;
export type NewChannelMessageSubscriptionResult = Apollo.SubscriptionResult<NewChannelMessageSubscription>;
export const NewDirectMessageDocument = gql`
    subscription NewDirectMessage($receiverId: String!, $teamId: String!) {
  newDirectMessage(receiverId: $receiverId, teamId: $teamId) {
    id
    text
    sender {
      id
      username
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useNewDirectMessageSubscription__
 *
 * To run a query within a React component, call `useNewDirectMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewDirectMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewDirectMessageSubscription({
 *   variables: {
 *      receiverId: // value for 'receiverId'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useNewDirectMessageSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewDirectMessageSubscription, NewDirectMessageSubscriptionVariables>) {
        return Apollo.useSubscription<NewDirectMessageSubscription, NewDirectMessageSubscriptionVariables>(NewDirectMessageDocument, baseOptions);
      }
export type NewDirectMessageSubscriptionHookResult = ReturnType<typeof useNewDirectMessageSubscription>;
export type NewDirectMessageSubscriptionResult = Apollo.SubscriptionResult<NewDirectMessageSubscription>;
export const NewUserStatusDocument = gql`
    subscription NewUserStatus($teamId: String!) {
  newUserStatus(teamId: $teamId) {
    ...RegularUserStatus
  }
}
    ${RegularUserStatusFragmentDoc}`;

/**
 * __useNewUserStatusSubscription__
 *
 * To run a query within a React component, call `useNewUserStatusSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewUserStatusSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewUserStatusSubscription({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useNewUserStatusSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewUserStatusSubscription, NewUserStatusSubscriptionVariables>) {
        return Apollo.useSubscription<NewUserStatusSubscription, NewUserStatusSubscriptionVariables>(NewUserStatusDocument, baseOptions);
      }
export type NewUserStatusSubscriptionHookResult = ReturnType<typeof useNewUserStatusSubscription>;
export type NewUserStatusSubscriptionResult = Apollo.SubscriptionResult<NewUserStatusSubscription>;