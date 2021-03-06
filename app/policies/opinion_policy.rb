class OpinionPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def show?
    # everyone
    true
  end

  def create?
    # only connected user
    user.present?
  end

  def update?
    # only admin
    user.admin
  end

  def destroy?
    # only admin
    user.admin
  end
end
