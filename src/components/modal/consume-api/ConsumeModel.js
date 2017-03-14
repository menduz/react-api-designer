import {List} from 'immutable'
import {Fragment} from "./Fragment";

export type ConsumeState = {
  fragments: List<Fragment>,
  isOpen: boolean,
  query: string,
  isSearching: boolean,
  isSubmitting: boolean,
  error: string
}